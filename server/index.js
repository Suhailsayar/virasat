require('dotenv').config();

const express = require('express');
const cors    = require('cors');
const path    = require('path');

const authRoutes    = require('./routes/auth');
const productRoutes = require('./routes/products');
const uploadRoutes  = require('./routes/upload');

const app  = express();
const PORT = process.env.PORT || 4000;

// ─── Middleware ───────────────────────────
app.use(cors({
  origin:      process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Static: serve uploaded images ───────
// Images stored in /server/uploads/ are served at /uploads/:filename
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ─── Routes ──────────────────────────────
app.use('/api/auth',     authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/upload',   uploadRoutes);

// ─── Health check ─────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'Virasat Connect API', timestamp: new Date().toISOString() });
});

// ─── 404 handler ─────────────────────────
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

// ─── Global error handler ─────────────────
app.use((err, _req, res, _next) => {
  console.error('[Unhandled Error]', err);
  res.status(500).json({ success: false, message: 'An unexpected error occurred.' });
});

app.listen(PORT, () => {
  console.log(`\n🪔  Virasat Connect API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health\n`);
});
