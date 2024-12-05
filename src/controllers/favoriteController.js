// Importerer funktioner fra modellen til at håndtere favoritter
const { addFavoriteProduct, removeFavoriteProduct, getFavoriteProducts } = require('../models/favoriteModel');

// Controller til at tilføje et produkt til favoritter
const addFavoriteController = async (req, res) => {
    // Henter bruger-ID og produkt-ID fra forespørgsels-body
    const { userId, productId } = req.body;

    try {
        // Tilføjer produktet til favoritter i databasen
        await addFavoriteProduct(userId, productId);

        // Returnerer succesrespons, hvis produktet blev tilføjet
        res.status(201).json({ message: 'Produktet blev tilføjet til favoritter.' });
    } catch (error) {
        // Logger fejl og returnerer en serverfejlrespons
        console.error('Fejl i addFavoriteController:', error);
        res.status(500).json({ message: 'Kunne ikke tilføje produkt til favoritter.', error });
    }
};

// Controller til at fjerne et produkt fra favoritter
const removeFavoriteController = async (req, res) => {
    // Henter bruger-ID og produkt-ID fra forespørgsels-body
    const { userId, productId } = req.body;

    try {
        // Fjerner produktet fra favoritter i databasen
        await removeFavoriteProduct(userId, productId);

        // Returnerer succesrespons, hvis produktet blev fjernet
        res.status(200).json({ message: 'Produktet blev fjernet fra favoritter.' });
    } catch (error) {
        // Logger fejl og returnerer en serverfejlrespons
        console.error('Fejl i removeFavoriteController:', error);
        res.status(500).json({ message: 'Kunne ikke fjerne produkt fra favoritter.', error });
    }
};

// Controller til at hente alle favoritter for en bruger
const getFavoritesController = async (req, res) => {
    // Henter bruger-ID fra forespørgsels-parametre
    const { userId } = req.params;

    try {
        // Henter favoritprodukterne fra databasen
        const favorites = await getFavoriteProducts(userId);

        // Tjekker om der findes favoritter for brugeren
        if (!favorites) {
            return res.status(404).json({ message: "Ingen favoritter fundet for brugeren." });
        }

        // Returnerer favoritprodukterne som JSON
        res.status(200).json(favorites);
    } catch (error) {
        // Logger fejl og returnerer en serverfejlrespons
        console.error("Fejl i getFavoritesController:", error.message, error.stack);
        res.status(500).json({ message: "Intern serverfejl", error: error.message });
    }
};

// Eksporterer controllerne, så de kan bruges i andre dele af applikationen
module.exports = { addFavoriteController, removeFavoriteController, getFavoritesController };