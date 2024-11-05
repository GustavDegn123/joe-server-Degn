// routes/orderRoutes.js
const express = require('express');
const { handlePayWithCard } = require('../controllers/orderController');

const router = express.Router();

// Route to handle payment and order creation
router.post('/', handlePayWithCard);

module.exports = router;
