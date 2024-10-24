// routes/userRoutes.js
const express = require('express');
const { createUserController } = require('../controllers/userController');

const router = express.Router();

router.post('/users', createUserController);

module.exports = router;

