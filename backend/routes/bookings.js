const express = require('express');
const router = express.Router();
const db = require('../db'); // Make sure your db.js exports the SQLite instance

// GET /api/bookings
router.get('/', (req, res) => {
    db.all("SELECT * FROM bookings ORDER BY id DESC", [], (err, rows) => {
        if (err) return res.json({ success: false, error: err.message });
        res.json(rows);
    });
});

// POST /api/bookings
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



module.exports = router;
