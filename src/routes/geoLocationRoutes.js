// Importerer Express-biblioteket
const express = require('express');

// Importerer node-fetch til at lave HTTP-forespørgsler
const fetch = require('node-fetch');

// Indlæser miljøvariabler fra .env-filen
require('dotenv').config();

// Opretter en ny routerinstans
const router = express.Router();

// Definerer en GET-route til at hente landekode baseret på latitude og longitude
router.get('/getCountryCode', async (req, res) => {
    // Henter latitude og longitude fra forespørgslens query-parametre
    const { latitude, longitude } = req.query;

    // Tjekker om både latitude og longitude er angivet
    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude og longitude er påkrævet' });
    }

    try {
        // Henter OpenCage API-nøglen fra miljøvariabler
        const apiKey = process.env.OPENCAGE_API_KEY;

        // Laver en HTTP-forespørgsel til OpenCage API for at hente geodata
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
        const data = await response.json();

        // Tjekker om resultater findes og udtrækker landekoden
        if (data.results && data.results.length > 0) {
            const countryCode = data.results[0].components.country_code.toUpperCase();
            res.json({ countryCode }); // Sender landekoden som svar
        } else {
            // Hvis der ikke findes en landekode i resultaterne
            res.status(404).json({ error: 'Landekode ikke fundet' });
        }
    } catch (error) {
        // Logger fejl og sender en serverfejl som svar
        console.error('Fejl ved hentning af landekode:', error);
        res.status(500).json({ error: 'Intern serverfejl' });
    }
});

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
