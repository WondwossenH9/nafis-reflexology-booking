const express = require('express');
const cors = require('cors');
require('dotenv').config();

const db = require('./db');
const bookingsRouter = require('./routes/bookings');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json()); // Required to parse JSON bodies

// Routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.send('Nafi\'s Reflexology API is running.');
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
