require('dotenv').config({ path: require('path').join(__dirname, '.env') });

const path = require('path');
const fs = require('fs');
const express = require('express');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const User = require('./models/User');

const REQUIRED_ENV = ['MONGODB_URI', 'SESSION_SECRET'];
const missing = REQUIRED_ENV.filter((k) => !process.env[k]);
if (!process.env.GEMINI_API_KEY && !process.env.API_KEY) missing.push('GEMINI_API_KEY');
if (missing.length) {
  console.error(`Missing required environment variables: ${missing.join(', ')}`);
  process.exit(1);
}

// Render sets RENDER=true. Behind its proxy we need trust proxy for secure
// cookies and accurate client IPs (used by rate limiting).
const isProd = process.env.NODE_ENV === 'production' || Boolean(process.env.RENDER);

const app = express();
app.disable('x-powered-by');
if (isProd) app.set('trust proxy', 1);

app.use(express.json({ limit: '100kb' }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
      collectionName: 'sessions',
      touchAfter: 24 * 3600,
    }),
    cookie: {
      secure: isProd,
      httpOnly: true,
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    },
  })
);

// ---------- API ----------

app.get('/api/health', (req, res) => {
  res.json({ ok: true, db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected' });
});

app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/ai'));
app.use('/api', require('./routes/mealPlans'));

app.use('/api', (req, res) => res.status(404).json({ message: 'Not found' }));

// ---------- Frontend (Vite build output) ----------

const buildDir = path.join(__dirname, '..', 'build');
if (fs.existsSync(buildDir)) {
  // Vite fingerprints files in /assets, so they can be cached forever.
  app.use('/assets', express.static(path.join(buildDir, 'assets'), { immutable: true, maxAge: '1y' }));
  app.use(express.static(buildDir, { maxAge: '1h', index: false }));
  app.get('*', (req, res) => res.sendFile(path.join(buildDir, 'index.html')));
} else {
  console.warn('No frontend build found. Run "npm run build" in the project root, or use "npm run dev" for development.');
}

// ---------- Start ----------

async function start() {
  await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 15000 });
  console.log(`MongoDB connected (db: ${mongoose.connection.name})`);

  // One-time cleanup: empty-string emails collide on the unique email index.
  const { modifiedCount } = await User.updateMany({ email: '' }, { $unset: { email: 1 } });
  if (modifiedCount) console.log(`Cleared empty email on ${modifiedCount} user(s)`);

  const port = process.env.PORT || 5000;
  app.listen(port, () => console.log(`Server running on port ${port}`));
}

start().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
