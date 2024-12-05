// Importerer Express-biblioteket
const express = require('express');

// Opretter en ny routerinstans
const router = express.Router();

// Importerer funktioner til asymmetrisk kryptering og dekryptering
const { encryptWithPublicKey, decryptWithPrivateKey } = require('../controllers/asymmetricController');

// Definerer en POST-route til at kryptere data asymmetrisk
router.post('/asymmetric/encrypt', (req, res) => {
    // Logger forespørgslens body for debugging
    console.log("Encrypt Request Body:", req.body);
    try {
        // Henter data-feltet fra forespørgslens body
        const { data } = req.body;

        // Tjekker, om data-feltet er til stede
        if (!data) {
            return res.status(400).json({ error: 'Data-felt er påkrævet' });
        }

        // Krypterer data ved hjælp af den offentlige nøgle
        const encryptedData = encryptWithPublicKey(JSON.stringify(data));

        // Logger det krypterede resultat for debugging
        console.log("Encrypted Data:", encryptedData);

        // Returnerer det krypterede data som svar
        res.json({ encryptedData });
    } catch (error) {
        // Logger fejl og returnerer en serverfejl
        console.error("Fejl ved asymmetrisk kryptering:", error.message);
        res.status(500).json({ error: 'Kryptering mislykkedes' });
    }
});

// Definerer en POST-route til at dekryptere data asymmetrisk
router.post('/asymmetric/decrypt', (req, res) => {
    try {
        // Henter encryptedData-feltet fra forespørgslens body
        const { encryptedData } = req.body;

        // Tjekker, om encryptedData-feltet er til stede
        if (!encryptedData) {
            return res.status(400).json({ error: 'Encrypted data-felt er påkrævet' });
        }

        // Dekrypterer data ved hjælp af den private nøgle
        const decryptedData = decryptWithPrivateKey(encryptedData);

        // Logger det dekrypterede resultat for debugging
        console.log("Decrypted Data:", decryptedData);

        // Returnerer det dekrypterede data som svar
        res.json({ decryptedData });
    } catch (error) {
        // Logger fejl og returnerer en serverfejl
        console.error("Fejl ved asymmetrisk dekryptering:", error.message);
        res.status(500).json({ error: 'Dekryptering mislykkedes' });
    }
});

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
