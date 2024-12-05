// Importerer modelen, der håndterer databaseoperationer for butikker
const storesModel = require('../models/storesModel');

// Funktion til at hente butikker og sende dem som JSON
async function getStores(req, res) {
    try {
        // Henter butiksdata fra databasen via modellen
        const stores = await storesModel.fetchStoresFromDatabase();

        // Sender butiksdataene som JSON til frontend
        res.json(stores);
    } catch (error) {
        // Logger fejl og sender en fejlrespons
        console.error('Fejl ved hentning af butikker:', error);
        res.status(500).send('Fejl ved hentning af butikker'); // Returnerer status 500 ved serverfejl
    }
}

// Eksporterer funktionen, så den kan bruges i andre dele af applikationen
module.exports = { getStores };
