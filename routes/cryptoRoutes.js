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

// Asymmetric encryption routes
router.post('/asymmetric/encrypt', (req, res) => {
    const { data } = req.body;
    const encryptedData = encryptWithPublicKey(data);
    res.json({ encryptedData });
});

router.post('/asymmetric/decrypt', (req, res) => {
    const { encryptedData } = req.body;
    const decryptedData = decryptWithPrivateKey(encryptedData);
    res.json({ decryptedData });
});

// Signature route
router.post('/sign', (req, res) => {
    const { data } = req.body;
    console.log('Signing Data:', data); // Debug log
    const signature = signData(data);
    console.log('Generated Signature:', signature); // Debug log
    res.json({ signature });
});

// Verification route
router.post('/verify', (req, res) => {
    const { data, signature } = req.body;
    console.log('Data to Verify:', data); // Debug log
    console.log('Signature to Verify:', signature); // Debug log
    const isValid = verifySignature(data, signature);
    console.log('Verification Result:', isValid); // Debug log
    res.json({ isValid });
});

module.exports = router;
