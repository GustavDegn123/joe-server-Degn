const express = require('express');
const { handlePayWithCard, handlePayWithLoyaltyPoints } = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

// Route to handle payment with card, with authMiddleware applied
router.post('/', authMiddleware, handlePayWithCard);

// Route to handle payment with loyalty points, with authMiddleware applied
router.post('/loyalty', authMiddleware, (req, res, next) => {
    console.log("Reached /api/orders/loyalty route");
    next();
}, handlePayWithLoyaltyPoints);

module.exports = router;
