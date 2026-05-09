const express  = require('express');
const bcrypt   = require('bcrypt');
const jwt      = require('jsonwebtoken');
const db       = require('../config/db');

const router = express.Router();
const SALT_ROUNDS = 10;

// ─────────────────────────────────────────
// POST /api/auth/register
// ─────────────────────────────────────────
router.post('/register', async (req, res) => {
  const { name, email, password, craft, village, state, bio } = req.body;

  // Validation
  if (!name || !email || !password || !craft || !village || !state) {
    return res.status(400).json({
      success: false,
      message: 'Please provide name, email, password, craft, village, and state.',
    });
  }
  if (password.length < 8) {
    return res.status(400).json({ success: false, message: 'Password must be at least 8 characters.' });
  }

  try {
    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM artisans WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists.' });
    }

    // Hash password
    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);

    // Insert artisan
    const [result] = await db.query(
      `INSERT INTO artisans (name, email, password_hash, craft, village, state, bio)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [name, email.toLowerCase(), password_hash, craft, village, state, bio || null]
    );

    const artisanId = result.insertId;

    // Issue JWT
    const token = jwt.sign(
      { id: artisanId, name, email: email.toLowerCase(), craft },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(201).json({
      success: true,
      message: 'Welcome to Virasat Connect! Your artisan account has been created.',
      token,
      artisan: { id: artisanId, name, email: email.toLowerCase(), craft, village, state },
    });
  } catch (err) {
    console.error('[Register Error]', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────
// POST /api/auth/login
// ─────────────────────────────────────────
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required.' });
  }

  try {
    const [rows] = await db.query('SELECT * FROM artisans WHERE email = ?', [email.toLowerCase()]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const artisan = rows[0];
    const isMatch = await bcrypt.compare(password, artisan.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const token = jwt.sign(
      { id: artisan.id, name: artisan.name, email: artisan.email, craft: artisan.craft },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    return res.status(200).json({
      success: true,
      message: `Welcome back, ${artisan.name}!`,
      token,
      artisan: {
        id:      artisan.id,
        name:    artisan.name,
        email:   artisan.email,
        craft:   artisan.craft,
        village: artisan.village,
        state:   artisan.state,
        bio:     artisan.bio,
      },
    });
  } catch (err) {
    console.error('[Login Error]', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────
// GET /api/auth/me  (protected)
// ─────────────────────────────────────────
const { verifyToken } = require('../middleware/auth');

router.get('/me', verifyToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, name, email, craft, village, state, bio, avatar_url, created_at FROM artisans WHERE id = ?',
      [req.artisan.id]
    );
    if (rows.length === 0) return res.status(404).json({ success: false, message: 'Artisan not found.' });
    return res.json({ success: true, artisan: rows[0] });
  } catch (err) {
    console.error('[Me Error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
