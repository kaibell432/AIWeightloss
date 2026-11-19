# Weight Loss App

AI-powered weight management suggestions and meal plans.

- **Frontend:** React 19, Vite, Tailwind CSS 4, [Radix UI](https://www.radix-ui.com) primitives, Overpass type, [Lucide](https://lucide.dev) icons. Visual system: see [DESIGN.md](DESIGN.md)
- **Backend:** Express, MongoDB (Mongoose), sessions stored in MongoDB
- **AI:** Google Gemini via `@google/genai`, with structured JSON output
- **Hosting:** Render free tier + MongoDB Atlas free tier

## Local development

```bash
npm install                      # installs frontend + server dependencies
cp server/.env.example server/.env   # then fill in the values
npm run dev:server               # API on http://localhost:5000
npm run dev                      # frontend on http://localhost:3000 (proxies /api)
```

Always run Vite through the npm scripts. `scripts/vite.mjs` fixes a Windows
path-casing issue that otherwise bundles React twice and crashes the app.

To test the production setup locally: `npm run build && npm start`, then open
http://localhost:5000.

## Environment variables

See [`server/.env.example`](server/.env.example). Required: `MONGODB_URI`,
`GEMINI_API_KEY` (or legacy `API_KEY`), `SESSION_SECRET`. Email export needs
`SMTP_*` settings and is disabled without them.

## Deploying to Render

| Setting | Value |
| --- | --- |
| Root directory | `weight-loss-app` |
| Build command | `npm install && npm run build` |
| Start command | `npm start` |
| Health check path | `/api/health` |

The root `npm install` also installs the server's dependencies (via `postinstall`).
In MongoDB Atlas, Network Access must allow `0.0.0.0/0`, because Render's free tier has
no static IP.

## AI models

`server/lib/gemini.js` tries models in order and falls back on overload, quota or
retirement errors. The defaults use Google's `-latest` aliases so the app survives
model retirements. Override with `GEMINI_MODELS`. Recipe links are web searches
rather than model-generated URLs, which are often invented.

## Project layout

```
index.html, vite.config.js   Vite entry + config (design tokens: src/index.css)
scripts/vite.mjs             Vite launcher (Windows path fix)
src/
  pages/                     Route components
  components/                App components (route.jsx: the route-map signature pieces)
  components/ui/             Radix-based kit: button, field, select, dialog, toast, tabs
  lib/                       API client, toasts, form options
server/
  index.js                   Express app: sessions, API routes, serves build/
  lib/gemini.js              Gemini client with model fallback
  lib/prompts.js             Prompts + JSON schemas
  routes/                    auth, ai, mealPlans
  models/                    User, MealPlan
```
