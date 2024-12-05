// Importerer mssql-biblioteket til at håndtere databaseforbindelser
const sql = require('mssql');
// Indlæser miljøvariabler fra en .env-fil
require('dotenv').config({ path: './.env.development' });

// Konfigurationsobjekt til databaseforbindelse
const config = {
    // Henter databasebruger fra miljøvariabler
    user: process.env.DB_USER,
    // Henter databasepassword fra miljøvariabler
    password: process.env.DB_PASSWORD,
    // Henter servernavn fra miljøvariabler
    server: process.env.DB_SERVER,
    // Henter databasenavn fra miljøvariabler
    database: process.env.DB_NAME,
    options: {
        // Indstiller kryptering baseret på miljøvariablen DB_ENCRYPT
        encrypt: process.env.DB_ENCRYPT === 'true', // Konverterer 'true' fra .env til boolsk værdi
    },
};

// Funktion til at oprette en forbindelse til databasen
async function getConnection() {
    try {
        // Forsøger at oprette en forbindelse til databasen med konfigurationen
        const pool = await sql.connect(config);
        console.log("Databaseforbindelse oprettet"); // Bekræfter succesfuld forbindelse
        return pool; // Returnerer databasepoolen for yderligere forespørgsler
    } catch (error) {
        // Logger fejl, hvis forbindelsen mislykkes
        console.error('Databaseforbindelse mislykkedes: ', error);
        console.error('Detaljeret fejlinformation: ', JSON.stringify(error, null, 2)); // Udskriver detaljeret fejlinfo
        throw error; // Kaster fejlen, så den kan håndteres af kaldende funktion
    }
}

// Eksporterer sql-objektet og getConnection-funktionen, så de kan bruges i andre filer
module.exports = { sql, getConnection };