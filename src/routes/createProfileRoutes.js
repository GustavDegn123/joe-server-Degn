const express = require('express');
const { createUserController } = require('../controllers/createProfileController');

const router = express.Router();

router.post('/createProfile', createUserController);

module.exports = router;
