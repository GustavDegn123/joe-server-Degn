// Importerer Express-biblioteket
const express = require('express');

// Opretter en ny routerinstans
const router = express.Router();

// Importerer funktionen til at hente billeder fra Cloudinary
const { listImages } = require('../controllers/cloudinaryController');

// Definerer en GET-route til at liste billeder fra Cloudinary
router.get('/list-images', async (req, res) => {
  try {
    // Henter billed-URL'er ved at kalde funktionen listImages
    const imageUrls = await listImages();

    // Returnerer billed-URL'er som JSON-respons
    res.json({ images: imageUrls });
  } catch (error) {
    // Returnerer en fejl, hvis billeder ikke kan hentes
    res.status(500).json({ error: "Kunne ikke hente billeder" });
  }
});

// Eksporterer routeren, så den kan bruges i andre dele af applikationen
module.exports = router;
