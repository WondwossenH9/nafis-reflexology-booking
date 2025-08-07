const express = require('express');
const router = express.Router();
const db = require('../db');
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/auth');

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const JWT_SECRET = process.env.JWT_SECRET || 'secret123'; // fallback if not set

// POST /api/admin/login
router.post('/login', (req, res) => {
    const { password } = req.body;

    if (!password) {
        return res.status(400).json({ success: false, error: 'Password is required.' });
    }

    if (password !== ADMIN_PASSWORD) {
        return res.status(401).json({ success: false, error: 'Invalid password' });
    }

    const token = jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ success: true, token });
});

router.get('/bookings', adminAuth, (req, res) => {
    try {
        const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
        res.json({ success: true, bookings });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// PATCH /api/admin/bookings/:id/complete
router.patch('/bookings/:id/complete', adminAuth, (req, res) => {
    const { id } = req.params;

    try {
        const stmt = db.prepare('UPDATE bookings SET completed = 1 WHERE id = ?');
        const info = stmt.run(id);

        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }

        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// DELETE /api/admin/bookings/:id
router.delete('/bookings/:id', adminAuth, (req, res) => {
    console.log('🔍 DELETE /api/admin/bookings/:id hit!');
    const id = req.params.id;
    try {
        const stmt = db.prepare("DELETE FROM bookings WHERE id = ?");
        const info = stmt.run(id);
        if (info.changes === 0) {
            return res.status(404).json({ success: false, error: 'Booking not found' });
        }
        res.json({ success: true, deleted: info.changes });
    } catch (err) {
        console.error('DELETE error:', err.message);
        res.status(500).json({ success: false, error: err.message });
    }
});



module.exports = router;
