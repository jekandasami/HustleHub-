const express = require('express');
const https = require('https');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');
const helmet = require('helmet');

// Import Routes
const authRoutes = require('./routes/authRoutes');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json()); // Parses incoming JSON payloads
app.use(helmet()); // Applies basic security headers

// Mount Routes
app.use('/api/auth', authRoutes);

// Basic Test Route
app.get('/api/status', (req, res) => {
    res.status(200).json({ message: 'Secure HustleHub+ API is running!' });
});

// Load SSL Certificates
const sslOptions = {
    key: fs.readFileSync(path.join(__dirname, 'certs', 'server.key')),
    cert: fs.readFileSync(path.join(__dirname, 'certs', 'server.cert'))
};

// Create and start the HTTPS server
https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`Secure server running on https://localhost:${PORT}`);
});