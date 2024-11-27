// models/receipeModel.js
const sql = require("mssql");
const config = require("../config/dbConfig");

async function getOrderDetails(orderId) {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("orderId", sql.Int, orderId)
            .query(`
                SELECT 
                    id AS order_id,
                    products,
                    total_price,
                    points_earned,
                    payment_method,
                    order_date
                FROM Orders 
                WHERE id = @orderId
            `);

        // Ensure products are parsed as JSON
        if (result.recordset[0]?.products) {
            result.recordset[0].products = JSON.parse(result.recordset[0].products);
        }

        return result.recordset[0];
    } catch (error) {
        console.error("Error fetching order details:", error);
        throw error;
    }
}

module.exports = {
    getOrderDetails
};
