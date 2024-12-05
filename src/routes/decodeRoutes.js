// Importerer Express-biblioteket
const express = require('express');

// Importerer middleware til autentifikation
const authMiddleware = require('../middleware/authMiddleware');

// Opretter en ny routerinstans
const router = express.Router();

// Definerer en GET-route til at hente bruger-ID for autentificerede brugere
router.get('/decode', authMiddleware, (req, res) => {
    // Returnerer bruger-ID'et fra det dekodede token
    res.json({ userId: req.userId });
});

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
