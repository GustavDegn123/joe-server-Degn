const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware"); // Import the auth middleware
const { getAllProducts } = require("../controllers/productsController"); // Import the controller

// Protect the getAllProducts route with authMiddleware
router.get("/", authMiddleware, getAllProducts);

module.exports = router;
