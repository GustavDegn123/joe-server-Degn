const express = require('express');
const { getLoyaltyCardData, updateUserProfile } = require('../controllers/myProfileController');
const authMiddleware = require('../middleware/authMiddleware'); // Ensure user is authenticated

const router = express.Router();

// Route to get loyalty card data
router.get('/my-profile', authMiddleware, getLoyaltyCardData);

// Route to update profile information
router.put('/edit-profile', authMiddleware, updateUserProfile);


module.exports = router;
