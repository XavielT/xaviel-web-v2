require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

// Import the contact handler
const contactHandler = require('./api/contact.js');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.post('/api/contact', async (req, res) => {
  try {
    // Set environment variables for development
    if (!process.env.RESEND_API_KEY) {
      console.warn('WARNING: RESEND_API_KEY not set in environment');
      return res.status(500).json({ 
        error: 'Server configuration error',
        message: 'RESEND_API_KEY environment variable is not set. Please set it in your .env file.'
      });
    }

    // Call the actual handler
    await contactHandler.default(req, res);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`Contact API available at http://localhost:${PORT}/api/contact`);
});
