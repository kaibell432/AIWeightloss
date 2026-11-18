const { GoogleGenAI } = require('@google/genai');

// The "-latest" aliases track Google's current models, so the app keeps working
// when specific versions get retired (gemini-1.5-flash and 2.5-flash both did).
// Override with a comma-separated GEMINI_MODELS env var.
const DEFAULT_MODELS = ['gemini-flash-latest', 'gemini-flash-lite-latest', 'gemini-3.5-flash-lite'];
const MODELS = (process.env.GEMINI_MODELS || DEFAULT_MODELS.join(','))
  .split(',')
  .map((m) => m.trim())
  .filter(Boolean);

// Errors worth trying the next model for: overloaded, out of quota, or model gone.
const RETRYABLE = new Set([404, 429, 500, 503, 504]);
const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 45000);
const PASSES = 2; // go through the model list twice if everything is overloaded
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

let client;
function getClient() {
  if (!client) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
    if (!apiKey) throw new Error('GEMINI_API_KEY (or API_KEY) is not set');
    // v1beta is required for the "-latest" aliases and JSON-schema output.
    client = new GoogleGenAI({
      apiKey,
      httpOptions: {
        apiVersion: 'v1beta',
        timeout: REQUEST_TIMEOUT_MS,
        // The SDK's default is 5 attempts with up to 60s backoff, which can hang a
        // request for minutes. We fail fast and fall through to the next model instead.
        retryOptions: { attempts: 1 },
      },
    });
  }
  return client;
}

function statusOf(err) {
  if (typeof err?.status === 'number') return err.status;
  const m = /"code":\s*(\d{3})/.exec(err?.message || '');
  return m ? Number(m[1]) : undefined;
}

function isRetryable(err) {
  const timedOut = ['AbortError', 'TimeoutError'].includes(err?.name) || /timed? ?out|aborted/i.test(err?.message || '');
  return RETRYABLE.has(statusOf(err)) || timedOut || err instanceof SyntaxError;
}

/**
 * Calls Gemini, falling back through MODELS on transient/availability errors.
 * Pass `schema` (a JSON Schema object) to get parsed JSON back; otherwise returns text.
 */
async function generate({ prompt, system, schema, temperature = 0.7 }) {
  const ai = getClient();
  let lastErr;

  for (let pass = 0; pass < PASSES; pass++) {
    if (pass > 0) {
      if (statusOf(lastErr) !== 503) break; // only re-run the list when models are overloaded
      await sleep(1500);
    }

    for (const model of MODELS) {
      try {
        const res = await ai.models.generateContent({
          model,
          contents: prompt,
          config: {
            temperature,
            ...(system ? { systemInstruction: system } : {}),
            ...(schema ? { responseMimeType: 'application/json', responseJsonSchema: schema } : {}),
          },
        });
        const text = res.text;
        if (!text) throw Object.assign(new Error('Empty response from model'), { status: 500 });
        return { model, data: schema ? JSON.parse(text) : text };
      } catch (err) {
        lastErr = err;
        console.warn(`[gemini] ${model} failed (${statusOf(err) ?? err.name}): ${(err.message || '').slice(0, 160)}`);
        if (!isRetryable(err)) break;
      }
    }
    if (!isRetryable(lastErr)) break;
  }

  const error = new Error('All Gemini models failed');
  error.cause = lastErr;
  error.status = statusOf(lastErr) === 429 ? 429 : 503;
  throw error;
}

module.exports = { generate, MODELS };
