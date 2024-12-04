const express = require("express");
const { loginController } = require("../controllers/loginController");

const router = express.Router();

// Login route
router.post("/login", loginController);

module.exports = router;
