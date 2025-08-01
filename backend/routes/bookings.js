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
        return res.json({ success: false, error: 'All fields are required.' });
    }

    console.log("Received booking:", { name, phone, date, time });

    const stmt = db.prepare("INSERT INTO bookings (name, phone, date, time) VALUES (?, ?, ?, ?)");
    stmt.run(
        String(name),
        String(phone),
        String(date),
        String(time),
        function (err) {
            if (err) return res.json({ success: false, error: err.message });
            res.json({ success: true, booking: { id: this.lastID, name, phone, date, time } });
        }
    );
});

module.exports = router;
