const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

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

module.exports = router;
