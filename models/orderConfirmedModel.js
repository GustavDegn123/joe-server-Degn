// models/receipeModel.js
const sql = require("mssql");
const config = require("../config/db");

async function getOrderDetails(orderId) {
    console.log("Executing database query for orderId:", orderId);

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            .input("orderId", sql.Int, orderId)
            .query(`
                SELECT 
                    id AS order_id, -- Explicitly alias 'id' as 'order_id'
                    ISNULL(products, '[]') AS products, -- Replace NULL with empty JSON
                    total_price,
                    points_earned,
                    payment_method,
                    order_date
                FROM Orders 
                WHERE id = @orderId -- Use 'id' directly in the WHERE clause
            `);

        console.log("Database query result:", result.recordset);

        if (result.recordset.length === 0) {
            console.error("No matching record found in the database for orderId:", orderId);
            return null;
        }

        const order = result.recordset[0];

        if (order.products) {
            try {
                order.products = JSON.parse(order.products); // Parse products JSON
            } catch (error) {
                console.error("Error parsing products JSON:", error);
                order.products = []; // Default to empty array if parsing fails
            }
        }

        return order;
    } catch (error) {
        console.error("Error in getOrderDetails:", error);
        throw error;
    }
}

module.exports = {
    getOrderDetails
};
