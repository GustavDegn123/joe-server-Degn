// models/receipeModel.js
const sql = require("mssql");
const config = require("../config/dbConfig");

async function getOrderDetails(orderId) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("orderId", sql.Int, orderId)
            .query(`
                SELECT * 
                FROM Orders 
                WHERE id = @orderId
            `);

        return result.recordset[0]; // Return the first result
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
}

module.exports = {
    getOrderDetails
};
