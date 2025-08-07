const express = require('express');
const router = express.Router();
const db = require('../db');
const adminAuth = require('../middleware/auth');

// GET /api/bookings
router.get('/', (req, res) => {
    try {
        const bookings = db.prepare("SELECT * FROM bookings ORDER BY id DESC").all();
        res.json(bookings);
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// POST /api/bookings
router.post('/', (req, res) => {
    const { name, phone, date, time } = req.body;

    if (!name || !phone || !date || !time) {
        return res.status(400).json({ success: false, error: 'All fields are required.' });
    }

    try {
        const stmt = db.prepare("INSERT INTO bookings (name, phone, date, time) VALUES (?, ?, ?, ?)");
        const info = stmt.run(name.trim(), phone.trim(), date.trim(), time.trim());

        res.json({
            success: true,
            booking: {
                id: info.lastInsertRowid,
                name, phone, date, time,
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/bookings/:id (admin only)
router.delete('/:id', adminAuth, (req, res) => {
    const id = req.params.id;
    try {
        console.log('Deleting booking with ID:', id);
        const stmt = db.prepare("DELETE FROM bookings WHERE id = ?");
        const info = stmt.run(id);
        console.log('Deleted rows:', info.changes);
        res.json({ success: true, deleted: info.changes });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

module.exports = router;
