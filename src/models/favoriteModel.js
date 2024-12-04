const { getConnection } = require('../../config/db');

const addFavoriteProduct = async (userId, productId) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', userId)
            .input('product_id', productId) // No encryption, use the original productId
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

const removeFavoriteProduct = async (userId, productId) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', userId)
            .input('product_id', productId) // No encryption, use the original productId
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

const getFavoriteProducts = async (userId) => {
    try {
        const pool = await getConnection();
        const result = await pool.request()
            .input('user_id', userId)
            .query(`
                SELECT p.* 
                FROM Products p
                JOIN Favorites f ON p.id = f.product_id
                WHERE f.user_id = @user_id;
            `);

        console.log(`Fetched favorite products for user ${userId}`);
        return result.recordset;
    } catch (error) {
        console.error('Error fetching favorite products:', error);
        throw error;
    }
};

module.exports = { addFavoriteProduct, removeFavoriteProduct, getFavoriteProducts };
