const express    = require('express');
const path       = require('path');
const fs         = require('fs');
const upload     = require('../middleware/upload');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// ─────────────────────────────────────────
// POST /api/upload
// Protected — artisan must be logged in
// Returns: { success, url } where url is the public path
// ─────────────────────────────────────────
router.post('/', verifyToken, upload.single('image'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'No image file provided.' });
  }

  // Build the public URL the frontend can use directly
  const publicUrl = `/uploads/${req.file.filename}`;

  return res.status(201).json({
    success: true,
    url: publicUrl,
    filename: req.file.filename,
    size: req.file.size,
  });
});

// ─────────────────────────────────────────
// DELETE /api/upload/:filename
// Protected — clean up old image when replaced
// ─────────────────────────────────────────
router.delete('/:filename', verifyToken, (req, res) => {
  const { filename } = req.params;

  // Security: strip any path traversal attempts
  const safe = path.basename(filename);
  const filepath = path.join(__dirname, '../uploads', safe);

  if (!fs.existsSync(filepath)) {
    return res.status(404).json({ success: false, message: 'File not found.' });
  }

  fs.unlink(filepath, (err) => {
    if (err) return res.status(500).json({ success: false, message: 'Could not delete file.' });
    return res.json({ success: true, message: 'File deleted.' });
  });
});

module.exports = router;
