const express = require('express');
const router = express.Router();
const { listImages } = require('../controllers/cloudinaryController');

router.get('/list-images', async (req, res) => {
    try {
        const imageUrls = await listImages();
        res.json({ images: imageUrls });
    } catch (error) {
        res.status(500).json({ error: "Could not fetch images" });
    }
});

module.exports = router;
