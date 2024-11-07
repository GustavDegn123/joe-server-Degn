// routes/favoriteRoutes.js
const express = require('express');
const { addFavoriteController, removeFavoriteController, getFavoritesController } = require('../controllers/favoriteController');

const router = express.Router();

router.post('/addFavorite', addFavoriteController);
router.delete('/removeFavorite', removeFavoriteController);
router.get('/:userId', getFavoritesController);

module.exports = router;
