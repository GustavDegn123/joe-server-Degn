// Importerer Express-biblioteket
const express = require('express');

// Importerer kontrolfunktioner til håndtering af betaling med kort og loyalitetspoint
const { handlePayWithCard, handlePayWithLoyaltyPoints } = require('../controllers/orderController');

// Importerer middleware til autentifikation
const authMiddleware = require('../middleware/authMiddleware');

// Opretter en ny routerinstans
const router = express.Router();

// Definerer en route til at håndtere betaling med kort, beskyttet med authMiddleware
router.post('/', authMiddleware, handlePayWithCard);

// Definerer en route til at håndtere betaling med loyalitetspoint, beskyttet med authMiddleware
router.post('/loyalty', authMiddleware, (req, res, next) => {
    // Logger en besked til konsollen, når ruten nås
    console.log("Nåede /api/orders/loyalty ruten");
    next(); // Går videre til næste middleware eller kontrolfunktion
}, handlePayWithLoyaltyPoints);

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
