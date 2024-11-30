// models/favoriteModel.js
const { getConnection } = require('../config/db');
const { encryptData, decryptData } = require('../controllers/symmetricController');

const addFavoriteProduct = async (userId, productId) => {
    try {
        const { encryptedData: encryptedProductId, iv } = encryptData(productId);

        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', userId)
            .input('product_id', encryptedProductId)
            .input('iv', iv)
            .query(`
                INSERT INTO Favorites (user_id, product_id, iv, updated_at)
                VALUES (@user_id, @product_id, @iv, GETDATE())
            `);

        console.log(`Product ${productId} encrypted and added to favorites for user ${userId}`);
        return result;
    } catch (error) {
        console.error('Error adding favorite product:', error);
        throw error;
    }
};

const removeFavoriteProduct = async (userId, productId) => {
    try {
        const { encryptedData: encryptedProductId } = encryptData(productId);

        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', userId)
            .input('product_id', encryptedProductId)
            .query(`
                DELETE FROM Favorites WHERE user_id = @user_id AND product_id = @product_id
            `);

        console.log(`Product ${productId} encrypted and removed from favorites for user ${userId}`);
        return result;
    } catch (error) {
        console.error('Error removing favorite product:', error);
        throw error;
    }
};

const getFavoriteProducts = async (userId) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', userId)
            .query(`
                SELECT f.product_id, f.iv, p.*
                FROM Favorites f
                JOIN Products p ON p.id = CONVERT(VARCHAR(MAX), f.product_id)
                WHERE f.user_id = @user_id
            `);

        // Decrypt product_id for each favorite
        const decryptedFavorites = result.recordset.map((favorite) => {
            const decryptedProductId = decryptData(favorite.product_id, favorite.iv);
            return {
                ...favorite,
                product_id: decryptedProductId,
            };
        });

        return decryptedFavorites;
    } catch (error) {
        console.error('Error fetching favorite products:', error);
        throw error;
    }
};

module.exports = { addFavoriteProduct, removeFavoriteProduct, getFavoriteProducts };
