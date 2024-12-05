// Importerer Express-biblioteket
const express = require('express');

// Importerer controlleren til at oprette en ny brugerprofil
const { createUserController } = require('../controllers/createProfileController');

// Opretter en ny routerinstans
const router = express.Router();

// Definerer en POST-route til at oprette en ny brugerprofil
router.post('/createProfile', createUserController);

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
