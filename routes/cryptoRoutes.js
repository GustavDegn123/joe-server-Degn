const express = require('express');
const router = express.Router();
const { encryptData, decryptData } = require('../controllers/symmetricController');
const { encryptWithPublicKey, decryptWithPrivateKey } = require('../controllers/asymmetricController');
const { signData, verifySignature } = require('../controllers/signatureController');

router.post('/symmetric/encrypt', (req, res) => {
    try {
        console.log('Request Body:', req.body); // Log request body
        const { data } = req.body;

        if (!data) {
            return res.status(400).json({ error: 'Data field is required' });
        }

        const { encryptedData, iv } = encryptData(data);
        res.status(200).json({ encryptedData, iv });
    } catch (error) {
        console.error('Error during encryption:', error.message);
        res.status(500).json({ error: 'Encryption failed' });
    }
});

router.post('/symmetric/decrypt', (req, res) => {
    const { encryptedData, iv } = req.body;
    const decryptedData = decryptData(encryptedData, iv);
    res.json({ decryptedData });
});

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

// Signature route
router.post('/sign', (req, res) => {
    const { data } = req.body;
    console.log('Signing Data:', data); // Debug log
    try {
        if (!data) {
            return res.status(400).json({ error: 'Data field is required' });
        }
        const signature = signData(data);
        console.log('Generated Signature:', signature); // Debug log
        res.json({ signature });
    } catch (error) {
        console.error("Error in signing data:", error.message);
        res.status(500).json({ error: 'Signing failed' });
    }
});

// Verification route
router.post('/verify', (req, res) => {
    const { data, signature } = req.body;
    console.log('Data to Verify:', data); // Debug log
    console.log('Signature to Verify:', signature); // Debug log
    try {
        if (!data || !signature) {
            return res.status(400).json({ error: 'Both data and signature are required' });
        }
        const isValid = verifySignature(data, signature);
        console.log('Verification Result:', isValid); // Debug log
        res.json({ isValid });
    } catch (error) {
        console.error("Error in verifying signature:", error.message);
        res.status(500).json({ error: 'Verification failed' });
    }
});

module.exports = router;
