const express = require('express');
const SessionController = require('../controllers/sessionController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// All session routes require authentication
router.use(authMiddleware);

// GET /api/sessions - Get all sessions for current user
router.get('/', SessionController.getAll);

// POST /api/sessions - Create a new session
router.post('/', SessionController.create);

// PUT /api/sessions/:id - Update a session
router.put('/:id', SessionController.update);

// DELETE /api/sessions/:id - Delete a session
router.delete('/:id', SessionController.delete);

module.exports = router;