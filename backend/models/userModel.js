const pool = require('../config/db');
const bcrypt = require('bcrypt');

// User Model - Handles all user-related database operations
class User {
  // Create a new user with hashed password
  static async create(username, password) {
    try {
      // Hash password with 10 salt rounds for security
      const hashedPassword = await bcrypt.hash(password, 10);
      
      const query = 'INSERT INTO users (username, password) VALUES (?, ?)';
      const [result] = await pool.execute(query, [username, hashedPassword]);
      
      return result;
    } catch (error) {
      throw new Error(`Error creating user: ${error.message}`);
    }
  }

  // Find user by username
  static async findByUsername(username) {
    try {
      const query = 'SELECT * FROM users WHERE username = ?';
      const [rows] = await pool.execute(query, [username]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Find user by ID
  static async findById(id) {
    try {
      const query = 'SELECT id, username FROM users WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error finding user: ${error.message}`);
    }
  }

  // Check if username already exists
  static async usernameExists(username) {
    try {
      const user = await this.findByUsername(username);
      return user !== null;
    } catch (error) {
      throw new Error(`Error checking username: ${error.message}`);
    }
  }

  // Verify password (compares plain password with hashed password)
  static async verifyPassword(plainPassword, hashedPassword) {
    try {
      return await bcrypt.compare(plainPassword, hashedPassword);
    } catch (error) {
      throw new Error(`Error verifying password: ${error.message}`);
    }
  }
}

module.exports = User;