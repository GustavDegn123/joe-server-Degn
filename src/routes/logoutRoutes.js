// Importerer Express-biblioteket
const express = require('express');

// Opretter en ny routerinstans
const router = express.Router();

// Definerer en POST-route til logout-funktionen
router.post('/logout', (req, res) => {
    // Sletter JWT-cookien, som bruges til autentifikation
    res.clearCookie('jwt', {
        httpOnly: true, // Gør cookien utilgængelig for JavaScript
        secure: process.env.NODE_ENV === 'production', // Gør cookien sikker kun i produktionsmiljø
        sameSite: 'Lax' // Begrænser cookiens tilgængelighed til samme site
    });

    // Sletter basket-cookien, som indeholder brugerens kurvdata
    res.clearCookie('basket', {
        httpOnly: true, // Gør cookien utilgængelig for JavaScript (valgfrit)
        secure: process.env.NODE_ENV === 'production', // Gør cookien sikker kun i produktionsmiljø
        sameSite: 'Lax' // Begrænser cookiens tilgængelighed til samme site
    });

    // Sender en succesrespons med beskeden "Logout successful"
    res.status(200).json({ message: 'Logout successful' });
});

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
