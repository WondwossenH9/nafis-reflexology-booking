const express = require('express');
const router = express.Router();
const db = require('../db'); // Make sure your db.js exports the better-sqlite3 instance
const adminAuth = require('../middleware/auth'); // Token middleware

// GET /api/bookings (Public)
router.get('/', (req, res) => {
    try {
        const stmt = db.prepare("SELECT * FROM bookings ORDER BY id DESC");
        const rows = stmt.all();
        res.json(rows);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/bookings (Public)
router.post('/', (req, res) => {
    const { name, phone, date, time } = req.body;

    if (!name || !phone || !date || !time) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    try {
        const stmt = db.prepare("INSERT INTO bookings (name, phone, date, time) VALUES (?, ?, ?, ?)");
        const info = stmt.run(
            String(name).trim(),
            String(phone).trim(),
            String(date).trim(),
            String(time).trim()
        );

        res.json({
            success: true,
            booking: {
                id: info.lastInsertRowid,
                name,
                phone,
                date,
                time,
            }
        });
    } catch (err) {
        console.error("Insert failed:", err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/bookings/:id (Admin only)
router.delete('/:id', adminAuth, (req, res) => {
    const { id } = req.params;
    try {
        const stmt = db.prepare("DELETE FROM bookings WHERE id = ?");
        const info = stmt.run(id);

        res.json({ success: true, deleted: info.changes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
