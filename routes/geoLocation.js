const express = require('express');
const fetch = require('node-fetch');
require('dotenv').config();

const router = express.Router();

router.get('/getCountryCode', async (req, res) => {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
        return res.status(400).json({ error: 'Latitude and longitude are required' });
    }

    try {
        const apiKey = process.env.OPENCAGE_API_KEY;
        const response = await fetch(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${apiKey}`);
        const data = await response.json();

        if (data.results && data.results.length > 0) {
            const countryCode = data.results[0].components.country_code.toUpperCase();
            res.json({ countryCode });
        } else {
            res.status(404).json({ error: 'Country code not found' });
        }
    } catch (error) {
        console.error('Error fetching country code:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
