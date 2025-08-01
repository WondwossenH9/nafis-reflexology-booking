const express = require('express');
const cors = require('cors');
require('dotenv').config();
const db = require('./db'); // Import the database connection

const app = express();
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

const bookingsRouter = require('./routes/bookings');
app.use('/api/bookings', bookingsRouter);

// Routes
app.get('/', (req, res) => {
    res.send('Nafi\'s Reflexology API is running.');
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Get all bookings
app.get('/api/bookings', (req, res) => {
    const bookings = db.prepare('SELECT * FROM bookings ORDER BY created_at DESC').all();
    res.json(bookings);
});

// Add new booking
app.post('/api/bookings', (req, res) => {
    const { name, phone, date, time } = req.body;
    if (!name || !phone || !date || !time) {
        return res.status(400).json({ error: 'Missing fields' });
    }

    const stmt = db.prepare('INSERT INTO bookings (name, phone, date, time) VALUES (?, ?, ?, ?)');
    const info = stmt.run(name, phone, date, time);

    res.json({ success: true, id: info.lastInsertRowid });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
