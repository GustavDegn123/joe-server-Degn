const express = require('express');
const router = express.Router();
const { encryptWithPublicKey, decryptWithPrivateKey } = require('../controllers/asymmetricController');

router.post('/asymmetric/encrypt', (req, res) => {
    console.log("Encrypt Request Body:", req.body); // Log request body inside the route handler
    try {
        const { data } = req.body;
        if (!data) {
            return res.status(400).json({ error: 'Data field is required' });
        }
        const encryptedData = encryptWithPublicKey(JSON.stringify(data)); // Encrypt serialized data
        console.log("Encrypted Data:", encryptedData); // Log the encrypted result
        res.json({ encryptedData });
    } catch (error) {
        console.error("Error in asymmetric encryption:", error.message);
        res.status(500).json({ error: 'Encryption failed' });
    }
});

router.post('/asymmetric/decrypt', (req, res) => {
    try {
        const { encryptedData } = req.body;
        if (!encryptedData) {
            return res.status(400).json({ error: 'Encrypted data field is required' });
        }
        const decryptedData = decryptWithPrivateKey(encryptedData);
        console.log("Decrypted Data:", decryptedData); // Log the decrypted result
        res.json({ decryptedData });
    } catch (error) {
        console.error("Error in asymmetric decryption:", error.message);
        res.status(500).json({ error: 'Decryption failed' });
    }
});

module.exports = router;
