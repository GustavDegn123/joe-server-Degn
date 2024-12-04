const express = require('express');
const router = express.Router();
const storesController = require('../controllers/storesController');

// Route til at hente butikker
router.get('/stores', storesController.getStores);

module.exports = router;
