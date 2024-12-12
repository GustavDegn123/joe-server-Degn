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

// Initialiserer en poolPromise til genbrug af forbindelser
const poolPromise = new sql.ConnectionPool(config)
    .connect()
    .then((pool) => {
        console.log('Databasepool initialiseret og klar til brug'); // Bekræfter succesfuld initialisering
        return pool;
    })
    .catch((error) => {
        console.error('Fejl under oprettelse af databasepool:', error); // Logger fejl, hvis initialisering mislykkes
        throw error; // Kaster fejl for yderligere behandling
    });

// Funktion til at udføre forespørgsler
async function executeQuery(query, params = {}) {
    try {
        const pool = await poolPromise; // Genbruger eksisterende poolforbindelse
        const request = pool.request();

        // Tilføjer parametre til forespørgslen, hvis de er angivet
        Object.keys(params).forEach((key) => {
            request.input(key, params[key].type, params[key].value);
        });

        // Udfører forespørgslen og returnerer resultatet
        const result = await request.query(query);
        return result;
    } catch (error) {
        console.error('Fejl under udførelse af forespørgsel:', error); // Logger fejl
        throw error; // Kaster fejl for yderligere behandling
    }
}

// Eksporterer poolPromise og executeQuery til brug i andre filer
module.exports = { sql, poolPromise, executeQuery };
