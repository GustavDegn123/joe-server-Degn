const express = require('express');
const router = express.Router();
const { getOrderDetailsJson } = require('../controllers/orderConfirmedController');

router.get('/order-details', getOrderDetailsJson);

module.exports = router;
