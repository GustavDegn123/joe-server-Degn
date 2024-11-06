// routes/orderRoutes.js
const express = require('express');
const { handlePayWithCard, handlePayWithLoyaltyPoints } = require('../controllers/orderController');

const router = express.Router();

// Route to handle payment with card
router.post('/', handlePayWithCard);

// Route to handle payment with loyalty points
router.post('/loyalty', (req, res, next) => {
    console.log("Reached /api/orders/loyalty route");
    next();
}, handlePayWithLoyaltyPoints);
module.exports = router;