// Importerer Express-biblioteket
const express = require("express");

// Importerer login-controlleren, der håndterer login-funktionen
const { loginController } = require("../controllers/loginController");

// Opretter en ny routerinstans
const router = express.Router();

// Definerer en POST-route til login
router.post("/login", loginController);

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
