const express = require('express');
const cors = require('cors');
require('dotenv').config();

const bookingsRouter = require('./routes/bookings');
const adminRouter = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/bookings', bookingsRouter);
app.use('/api/admin', adminRouter); // ✅ only once!

// Health check
app.get('/', (req, res) => {
    res.send("Nafi's Reflexology API is running.");
});

app.get('/api/status', (req, res) => {
    res.json({ status: 'OK', timestamp: new Date() });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
