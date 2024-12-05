// Importerer Express-biblioteket
const express = require('express');

// Importerer kontrolfunktioner til håndtering af favoritter
const { 
    addFavoriteController, 
    removeFavoriteController, 
    getFavoritesController 
} = require('../controllers/favoriteController');

// Importerer middleware til autentifikation
const authMiddleware = require('../middleware/authMiddleware');

// Opretter en ny routerinstans
const router = express.Router();

// Definerer en POST-route til at tilføje en favorit, beskyttet med authMiddleware
router.post('/addFavorite', authMiddleware, addFavoriteController);

// Definerer en DELETE-route til at fjerne en favorit, beskyttet med authMiddleware
router.delete('/removeFavorite', authMiddleware, removeFavoriteController);

// Definerer en GET-route til at hente alle favoritter for en specifik bruger, beskyttet med authMiddleware
router.get('/:userId', authMiddleware, getFavoritesController);

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
