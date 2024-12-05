// Importerer databaseforbindelsen og SQL-objektet
const { sql, getConnection } = require('../../config/db'); // Juster stien baseret på placeringen af db.js

// Funktion til at hente alle produkter fra databasen
async function getAllProducts(req, res) {
    try {
        // Opretter forbindelse til databasen
        const pool = await getConnection();

        // Udfører en SQL-forespørgsel for at hente alle produkter fra tabellen "Products"
        const result = await pool.request().query('SELECT * FROM dbo.Products');

        // Sender produkterne som JSON-svar, inklusiv points_value
        res.json(result.recordset);
    } catch (err) {
        // Logger fejl og sender en fejlrespons ved serverproblemer
        console.error("Fejl ved hentning af produkter:", err);
        res.status(500).json({ error: "Kunne ikke hente produkter" });
    }
}

// Eksporterer funktionen, så den kan bruges i andre dele af applikationen
module.exports = {
    getAllProducts
};
