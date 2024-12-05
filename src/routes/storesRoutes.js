// Importerer Express-biblioteket
const express = require('express');

// Opretter en ny routerinstans
const router = express.Router();

// Importerer controlleren, der håndterer butikrelaterede funktioner
const storesController = require('../controllers/storesController');

// Definerer en route til at hente butikker
router.get('/stores', storesController.getStores);

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
