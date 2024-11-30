const { addFavoriteProduct, removeFavoriteProduct, getFavoriteProducts } = require('../models/favoriteModel');

const addFavoriteController = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        await addFavoriteProduct(userId, productId);
        res.status(201).json({ message: 'Product successfully added to favorites.' });
    } catch (error) {
        console.error('Error in addFavoriteController:', error);
        res.status(500).json({ message: 'Could not add product to favorites.', error });
    }
};

const removeFavoriteController = async (req, res) => {
    const { userId, productId } = req.body;

    try {
        await removeFavoriteProduct(userId, productId);
        res.status(200).json({ message: 'Product successfully removed from favorites.' });
    } catch (error) {
        console.error('Error in removeFavoriteController:', error);
        res.status(500).json({ message: 'Could not remove product from favorites.', error });
    }
};

const getFavoritesController = async (req, res) => {
    const { userId } = req.params;

    try {
        // Fetch favorites from the database
        const favorites = await getFavoriteProducts(userId);

        if (!favorites) {
            return res.status(404).json({ message: "No favorites found for the user." });
        }

        res.status(200).json(favorites);
    } catch (error) {
        console.error("Error in getFavoritesController:", error.message, error.stack);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = { addFavoriteController, removeFavoriteController, getFavoritesController };
