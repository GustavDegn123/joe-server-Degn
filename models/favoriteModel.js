// models/favoriteModel.js
const { getConnection } = require('../config/db');

// Function to add a product to favorites
const addFavoriteProduct = async (userId, productId) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', userId)      // Use exact column name from the database
            .input('product_id', productId) // Use exact column name from the database
            .query(`
                INSERT INTO Favorites (user_id, product_id, updated_at)
                VALUES (@user_id, @product_id, GETDATE())
            `);

        console.log(`Product ${productId} added to favorites for user ${userId}`);
        return result;
    } catch (error) {
        console.error('Error adding favorite product:', error);
        throw error;
    }
};

// Function to remove a product from favorites
const removeFavoriteProduct = async (userId, productId) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', userId)
            .input('product_id', productId)
            .query(`
                DELETE FROM Favorites WHERE user_id = @user_id AND product_id = @product_id
            `);

        console.log(`Product ${productId} removed from favorites for user ${userId}`);
        return result;
    } catch (error) {
        console.error('Error removing favorite product:', error);
        throw error;
    }
};

// Function to get all favorite products for a user
const getFavoriteProducts = async (userId) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', userId)
            .query(`
                SELECT p.* FROM Products p
                JOIN Favorites f ON p.id = f.product_id
                WHERE f.user_id = @user_id
            `);

        return result.recordset;
    } catch (error) {
        console.error('Error fetching favorite products:', error);
        throw error;
    }
};

module.exports = { addFavoriteProduct, removeFavoriteProduct, getFavoriteProducts };
