const storesModel = require('../models/storesModel');

async function getStores(req, res) {
    try {
        const stores = await storesModel.fetchStoresFromDatabase();
        res.json(stores); // Sender dataene som JSON til frontend
    } catch (error) {
        console.error('Error fetching stores:', error);
        res.status(500).send('Fejl ved hentning af butikker');
    }
}

module.exports = { getStores };
