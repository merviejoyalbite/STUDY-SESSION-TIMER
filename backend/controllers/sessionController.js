const Session = require('../models/sessionModel');

// Session Controller - Handles study session CRUD operations
class SessionController {
  // Create a new session
  static async create(req, res) {
    try {
      const { title, studyTime, breakTime } = req.body;
      const userId = req.session.userId;

      // Validate input
      if (!title || !studyTime || !breakTime) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title, study time, and break time are required.' 
        });
      }

      // Create session
      await Session.create(userId, title, studyTime, breakTime);

      res.status(201).json({ 
        success: true, 
        message: 'Session created successfully.' 
      });
    } catch (error) {
      console.error('Session creation error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error.' 
      });
    }
  }

  // Get all sessions for current user
  static async getAll(req, res) {
    try {
      const userId = req.session.userId;
      const sessions = await Session.findByUserId(userId);

      res.json({ 
        success: true, 
        sessions 
      });
    } catch (error) {
      console.error('Fetch sessions error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error.' 
      });
    }
  }

  // Update a session
  static async update(req, res) {
    try {
      const { id } = req.params;
      const { title, studyTime, breakTime } = req.body;
      const userId = req.session.userId;

      // Validate input
      if (!title || !studyTime || !breakTime) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title, study time, and break time are required.' 
        });
      }

      const result = await Session.update(id, userId, title, studyTime, breakTime);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Session not found.'
        });
      }

      res.json({ 
        success: true, 
        message: 'Session updated successfully.' 
      });
    } catch (error) {
      console.error('Session update error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error.' 
      });
    }
  }

  // Delete a session
  static async delete(req, res) {
    try {
      const { id } = req.params;
      const userId = req.session.userId;

      const result = await Session.delete(id, userId);

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: 'Session not found.'
        });
      }

      res.json({ 
        success: true, 
        message: 'Session deleted successfully.' 
      });
    } catch (error) {
      console.error('Session delete error:', error);
      res.status(500).json({ 
        success: false, 
        message: 'Internal server error.' 
      });
    }
  }
}

module.exports = SessionController;
