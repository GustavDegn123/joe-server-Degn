// decodeRoutes.js
const express = require('express');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to get the user ID for authenticated users
router.get('/decode', authMiddleware, (req, res) => {
    res.json({ userId: req.userId}); // Send userId from decoded token
});

module.exports = router;
