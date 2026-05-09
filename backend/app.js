const express = require('express');
const session = require('express-session');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

require('./config/db');

const authRoutes = require('./routes/authRoutes');
const sessionRoutes = require('./routes/sessionRoutes');

const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5001',
  'http://localhost:3000'
].filter(Boolean);

app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  secret: process.env.SESSION_SECRET || 'change-this-session-secret',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

const frontendPath = path.join(__dirname, '../frontend');

app.use(express.static(frontendPath));
app.use('/frontend', express.static(frontendPath));

app.use('/api', authRoutes);
app.use('/api/sessions', sessionRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/views/index.html'));
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found.' });
});

module.exports = app;
