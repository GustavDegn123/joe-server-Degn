// Importerer nødvendige moduler
const cloudinary = require('cloudinary').v2;
require('dotenv').config(); // Loader miljøvariabler fra .env-filen

// Konfigurerer Cloudinary med miljøvariabler
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Henter Cloudinary Cloud Name fra .env
  api_key: process.env.CLOUDINARY_API_KEY, // Henter API Key fra .env
  api_secret: process.env.CLOUDINARY_API_SECRET // Henter API Secret fra .env
});

module.exports = cloudinary;
