// Importerer Express-biblioteket
const express = require('express');

// Importerer kontrolfunktioner til at hente loyalitetskortdata og opdatere brugerprofil
const { getLoyaltyCardData, updateUserProfile } = require('../controllers/myProfileController');

// Importerer middleware til autentifikation
const authMiddleware = require('../middleware/authMiddleware');

// Opretter en ny routerinstans
const router = express.Router();

// Definerer en route til at hente data for loyalitetskort, beskyttet med authMiddleware
router.get('/my-profile', authMiddleware, getLoyaltyCardData);

// Definerer en route til at opdatere brugerens profil, beskyttet med authMiddleware
router.put('/edit-profile', authMiddleware, updateUserProfile);

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
