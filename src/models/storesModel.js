// Importerer databaseforbindelsen
const { poolPromise } = require('../../config/db');

// Funktion til at hente butikker fra databasen
async function fetchStoresFromDatabase() {
    try {
        // Genbruger poolforbindelsen
        const pool = await poolPromise;

        // Udfører en SQL-forespørgsel for at hente butikoplysninger
        const result = await pool.request().query(
            'SELECT StoreID, Titel, Adresse, Åbningstidspunkt, Latitude, Longitude FROM dbo.Stores'
        );

        // Returnerer data som en array af objekter
        return result.recordset;
    } catch (error) {
        // Logger en fejl, hvis forespørgslen mislykkes, og smider en undtagelse
        console.error('Fejl ved hentning af butikker fra databasen:', error);
        throw error;
    }
}

// Eksporterer funktionen, så den kan bruges i andre dele af applikationen
module.exports = { fetchStoresFromDatabase };
