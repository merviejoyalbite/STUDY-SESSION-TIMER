const express = require('express');
const AuthController = require('../controllers/authController');

const router = express.Router();

// POST /api/register - Register a new user
router.post('/register', AuthController.register);

// POST /api/login - Login user
router.post('/login', AuthController.login);

// GET /api/logout - Logout user
router.get('/logout', AuthController.logout);

// GET /api/current-user - Get current authenticated user
router.get('/current-user', AuthController.getCurrentUser);

module.exports = router;