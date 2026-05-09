const pool = require('../config/db');

// Session Model - Handles all study session-related database operations
class Session {
  // Create a new study session
  static async create(userId, title, studyTime, breakTime) {
    try {
      const query = 'INSERT INTO sessions (user_id, title, study_time, break_time) VALUES (?, ?, ?, ?)';
      const [result] = await pool.execute(query, [userId, title, studyTime, breakTime]);
      
      return result;
    } catch (error) {
      throw new Error(`Error creating session: ${error.message}`);
    }
  }

  // Get all sessions for a specific user
  static async findByUserId(userId) {
    try {
      const query = 'SELECT * FROM sessions WHERE user_id = ? ORDER BY id DESC';
      const [rows] = await pool.execute(query, [userId]);
      
      return rows;
    } catch (error) {
      throw new Error(`Error fetching sessions: ${error.message}`);
    }
  }

  // Get a single session by ID
  static async findById(id) {
    try {
      const query = 'SELECT * FROM sessions WHERE id = ?';
      const [rows] = await pool.execute(query, [id]);
      
      return rows.length > 0 ? rows[0] : null;
    } catch (error) {
      throw new Error(`Error finding session: ${error.message}`);
    }
  }

  // Update an existing session
  static async update(id, userId, title, studyTime, breakTime) {
    try {
      const query = 'UPDATE sessions SET title = ?, study_time = ?, break_time = ? WHERE id = ? AND user_id = ?';
      const [result] = await pool.execute(query, [title, studyTime, breakTime, id, userId]);
      
      return result;
    } catch (error) {
      throw new Error(`Error updating session: ${error.message}`);
    }
  }

  // Delete a session
  static async delete(id, userId) {
    try {
      const query = 'DELETE FROM sessions WHERE id = ? AND user_id = ?';
      const [result] = await pool.execute(query, [id, userId]);
      
      return result;
    } catch (error) {
      throw new Error(`Error deleting session: ${error.message}`);
    }
  }
}

module.exports = Session;
