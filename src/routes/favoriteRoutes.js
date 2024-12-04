const express = require('express');
const { addFavoriteController, removeFavoriteController, getFavoritesController } = require('../controllers/favoriteController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Tilføj authMiddleware for at beskytte favorit-endpoints
router.post('/addFavorite', authMiddleware, addFavoriteController);
router.delete('/removeFavorite', authMiddleware, removeFavoriteController);
router.get('/:userId', authMiddleware, getFavoritesController);

module.exports = router;

