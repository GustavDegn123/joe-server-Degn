const { getConnection } = require('../../config/db');

async function fetchStoresFromDatabase() {
    try {
        const pool = await getConnection();
        const result = await pool.request().query('SELECT StoreID, Titel, Adresse, Åbningstidspunkt, Latitude, Longitude FROM dbo.Stores');
        return result.recordset; // Returnerer data som en array af objekter
    } catch (error) {
        console.error('Error fetching stores from database:', error);
        throw error;
    }
}

module.exports = { fetchStoresFromDatabase };