// controllers/receipeController.js
const { getOrderDetails } = require("../models/orderConfirmedModel");

async function getOrderDetailsJson(req, res) {
    const orderId = parseInt(req.query.orderId, 10); // Ensure orderId is an integer

    console.log("Received query parameter orderId:", orderId); // Log the parsed orderId

    if (!orderId || isNaN(orderId)) {
        console.error("Invalid or missing orderId.");
        return res.status(400).json({ error: "Order ID is required and must be a valid number." });
    }

    try {
        const orderDetails = await getOrderDetails(orderId);

        if (!orderDetails) {
            console.error("No order found for ID:", orderId);
            return res.status(404).json({ error: "Order not found." });
        }

        console.log("Fetched order details:", JSON.stringify(orderDetails, null, 2));
        res.json(orderDetails);
    } catch (error) {
        console.error("Error in getOrderDetailsJson:", error);
        res.status(500).json({ error: "An error occurred while fetching the order details." });
    }
}

module.exports = {
    getOrderDetailsJson
};
