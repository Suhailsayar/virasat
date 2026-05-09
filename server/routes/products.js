const express      = require('express');
const { v4: uuidv4 } = require('uuid');
const db           = require('../config/db');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────
// Fair-Trade Price Calculator (pure function)
// Living wage in India: ~₹350/hr (urban estimate)
// Formula: (hours × LIVING_WAGE) + material_cost + 20% overhead
// ─────────────────────────────────────────
const LIVING_WAGE_PER_HOUR = 350; // INR
const OVERHEAD_FACTOR      = 1.20;

function calculateFairPrice(hoursWorked, materialCost) {
  const labourCost  = hoursWorked * LIVING_WAGE_PER_HOUR;
  const rawTotal    = labourCost + parseFloat(materialCost);
  const fairPrice   = Math.ceil(rawTotal * OVERHEAD_FACTOR);
  return {
    labour_cost:    labourCost,
    material_cost:  parseFloat(materialCost),
    overhead:       Math.ceil(rawTotal * 0.20),
    suggested_price: fairPrice,
  };
}

// ─────────────────────────────────────────
// POST /api/products
// Create a new product (protected)
// ─────────────────────────────────────────
router.post('/', verifyToken, async (req, res) => {
  const { name, material, hours_worked, material_cost, final_price, story, image_url } = req.body;

  if (!name || !material || !hours_worked || !material_cost || !final_price || !story) {
    return res.status(400).json({
      success: false,
      message: 'All fields are required: name, material, hours_worked, material_cost, final_price, story.',
    });
  }

  try {
    const priceCalc      = calculateFairPrice(parseFloat(hours_worked), parseFloat(material_cost));
    const certificate_id = uuidv4();

    const [result] = await db.query(
      `INSERT INTO products
        (artisan_id, name, material, hours_worked, material_cost, suggested_price, final_price, story, image_url, certificate_id)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        req.artisan.id,
        name,
        material,
        parseFloat(hours_worked),
        parseFloat(material_cost),
        priceCalc.suggested_price,
        parseFloat(final_price),
        story,
        image_url || null,
        certificate_id,
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Product registered successfully! Your Digital Birth Certificate is ready.',
      product: {
        id:             result.insertId,
        certificate_id,
        name,
        image_url:      image_url || null,
        suggested_price: priceCalc.suggested_price,
        story_url:      `/product/${certificate_id}`,
      },
    });
  } catch (err) {
    console.error('[Create Product Error]', err);
    return res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ─────────────────────────────────────────
// GET /api/products/mine
// List all products for logged-in artisan (protected)
// ─────────────────────────────────────────
router.get('/mine', verifyToken, async (req, res) => {
  try {
    const [products] = await db.query(
      `SELECT p.*, a.name AS artisan_name, a.craft, a.village, a.state
       FROM products p
       JOIN artisans a ON p.artisan_id = a.id
       WHERE p.artisan_id = ?
       ORDER BY p.created_at DESC`,
      [req.artisan.id]
    );
    return res.json({ success: true, products });
  } catch (err) {
    console.error('[My Products Error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────
// GET /api/products/:certificateId
// Public product story page (NO auth required)
// ─────────────────────────────────────────
router.get('/:certificateId', async (req, res) => {
  const { certificateId } = req.params;

  try {
    const [rows] = await db.query(
      `SELECT
         p.id,
         p.name             AS product_name,
         p.material,
         p.hours_worked,
         p.material_cost,
         p.suggested_price,
         p.final_price,
         p.story,
         p.image_url,
         p.certificate_id,
         p.is_sold,
         p.created_at       AS registered_on,
         a.id               AS artisan_id,
         a.name             AS artisan_name,
         a.craft,
         a.village,
         a.state,
         a.bio              AS artisan_bio,
         a.avatar_url
       FROM products p
       JOIN artisans a ON p.artisan_id = a.id
       WHERE p.certificate_id = ?`,
      [certificateId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Product not found. Invalid certificate ID.' });
    }

    return res.json({ success: true, product: rows[0] });
  } catch (err) {
    console.error('[Get Product Error]', err);
    return res.status(500).json({ success: false, message: 'Server error.' });
  }
});

// ─────────────────────────────────────────
// GET /api/products/calculator/estimate
// Fair-trade price estimator (public utility)
// Query: ?hours=12&material_cost=500
// ─────────────────────────────────────────
router.get('/calculator/estimate', (req, res) => {
  const { hours, material_cost } = req.query;
  if (!hours || !material_cost) {
    return res.status(400).json({ success: false, message: 'Provide hours and material_cost as query params.' });
  }
  const calc = calculateFairPrice(parseFloat(hours), parseFloat(material_cost));
  return res.json({ success: true, ...calc, living_wage_per_hour: LIVING_WAGE_PER_HOUR });
});

module.exports = router;
