// Importerer databaseforbindelsen
const { poolPromise } = require('../../config/db');

// Funktion til at tilføje et produkt til brugerens favoritter
const addFavoriteProduct = async (userId, productId) => {
    try {
        // Genbruger poolforbindelsen
        const pool = await poolPromise;

        // Indsætter et favoritprodukt for en bestemt bruger i databasen
        const result = await pool.request()
            .input('user_id', sql.Int, userId) // Binder bruger-ID
            .input('product_id', sql.Int, productId) // Binder produkt-ID
            .query(`
                INSERT INTO Favorites (user_id, product_id, updated_at)
                VALUES (@user_id, @product_id, GETDATE())
            `);

        // Logger succesbesked
        console.log(`Produkt ${productId} tilføjet til favoritter for bruger ${userId}`);
        return result; // Returnerer resultatet af forespørgslen
    } catch (error) {
        // Logger fejl og smider en undtagelse
        console.error('Fejl ved tilføjelse af favoritprodukt:', error);
        throw error;
    }
};

// Funktion til at fjerne et produkt fra brugerens favoritter
const removeFavoriteProduct = async (userId, productId) => {
    try {
        // Genbruger poolforbindelsen
        const pool = await poolPromise;

        // Sletter en favoritpost for en bestemt bruger fra databasen
        const result = await pool.request()
            .input('user_id', sql.Int, userId) // Binder bruger-ID
            .input('product_id', sql.Int, productId) // Binder produkt-ID
            .query(`
                DELETE FROM Favorites WHERE user_id = @user_id AND product_id = @product_id
            `);

        // Logger succesbesked
        console.log(`Produkt ${productId} fjernet fra favoritter for bruger ${userId}`);
        return result; // Returnerer resultatet af forespørgslen
    } catch (error) {
        // Logger fejl og smider en undtagelse
        console.error('Fejl ved fjernelse af favoritprodukt:', error);
        throw error;
    }
};

// Funktion til at hente brugerens favoritprodukter
const getFavoriteProducts = async (userId) => {
    try {
        // Genbruger poolforbindelsen
        const pool = await poolPromise;

        // Henter en liste over brugerens favoritprodukter fra databasen
        const result = await pool.request()
            .input('user_id', sql.Int, userId) // Binder bruger-ID
            .query(`
                SELECT p.* 
                FROM Products p
                JOIN Favorites f ON p.id = f.product_id
                WHERE f.user_id = @user_id;
            `);

        // Logger succesbesked
        console.log(`Hentede favoritprodukter for bruger ${userId}`);
        return result.recordset; // Returnerer listen af favoritprodukter
    } catch (error) {
        // Logger fejl og smider en undtagelse
        console.error('Fejl ved hentning af favoritprodukter:', error);
        throw error;
    }
};

// Eksporterer funktionerne, så de kan bruges i andre dele af applikationen
module.exports = { addFavoriteProduct, removeFavoriteProduct, getFavoriteProducts };
