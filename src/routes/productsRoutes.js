// Importerer Express-biblioteket
const express = require("express");

// Opretter en ny routerinstans
const router = express.Router();

// Importerer middleware til autentifikation
const authMiddleware = require("../middleware/authMiddleware");

// Importerer controlleren, der håndterer produktrelaterede funktioner
const { getAllProducts } = require("../controllers/productsController");

// Definerer en route til at hente alle produkter, beskyttet med authMiddleware
router.get("/", authMiddleware, getAllProducts);

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
