const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'dut2sot5p', // Udskift med dit Cloudinary cloud name
  api_key: '376296236998194',       // Udskift med dit API key
  api_secret: '3vRNT9hETzlgdSI0B_X2_A5AriM'   // Udskift med dit API secret
});

module.exports = cloudinary;
