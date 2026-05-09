const User = require('../models/userModel');

// Authentication Controller - Handles user registration and login logic
class AuthController {
  // Register a new user
  static async register(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username and password are required.' 
        });
      }

      // Check if username already exists
      const userExists = await User.usernameExists(username);
      if (userExists) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username already exists.' 
        });
      }

      // Create new user with hashed password
      await User.create(username, password);

      res.status(201).json({ 
        success: true, 
        message: 'User registered successfully. Please login.' 
      });
    } catch (error) {
      console.error('Registration error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error.' 
      });
    }
  }

  // Login user
  static async login(req, res) {
    try {
      const { username, password } = req.body;

      // Validate input
      if (!username || !password) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username and password are required.' 
        });
      }

      // Find user in database
      const user = await User.findByUsername(username);
      if (!user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials.' 
        });
      }

      // Verify password
      const isPasswordValid = await User.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ 
          success: false, 
          message: 'Invalid credentials.' 
        });
      }

      // Create session for authenticated user
      req.session.userId = user.id;
      req.session.username = user.username;

      res.json({ 
        success: true, 
        message: 'Login successful!',
        user: {
          id: user.id,
          username: user.username
        }
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error.' 
      });
    }
  }

  // Logout user
  static logout(req, res) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).json({ 
          success: false, 
          message: 'Could not logout.' 
        });
      }

      res.json({ 
        success: true, 
        message: 'Logged out successfully.' 
      });
    });
  }

  // Get current user info (for checking if logged in)
  static async getCurrentUser(req, res) {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ 
          success: false, 
          message: 'Not authenticated.' 
        });
      }

      const user = await User.findById(req.session.userId);
      res.json({ 
        success: true, 
        user 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error.' 
      });
    }
  }
}

module.exports = AuthController;