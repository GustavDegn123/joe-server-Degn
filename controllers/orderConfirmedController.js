// controllers/receipeController.js
const { getOrderDetails } = require("../models/orderConfirmedModel");

async function getOrderDetailsJson(req, res) {
    const orderId = req.query.orderId;

    if (!orderId) {
        return res.status(400).json({ error: "Order ID is required." });
    }

    try {
        const orderDetails = await getOrderDetails(orderId);

        if (!orderDetails) {
            return res.status(404).json({ error: "Order not found." });
        }

        // Parse products JSON if stored as a JSON string
        if (typeof orderDetails.products === "string") {
            orderDetails.products = JSON.parse(orderDetails.products);
        }

        res.json(orderDetails);
    } catch (error) {
        console.error("Error fetching order details:", error);
        res.status(500).json({ error: "An error occurred while fetching the order details." });
    }
}

module.exports = {
    getOrderDetailsJson
};
