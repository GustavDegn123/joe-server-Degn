// Importerer databaseforbindelsen
const { poolPromise, sql } = require('../../config/db');

// Funktion til at oprette en ny ordre i databasen
const createOrder = async (orderData) => {
    console.log("Opretter ordre i databasen:", orderData);

    const {
        user_id,
        products,
        total_price,
        points_earned,
        payment_method,
        order_date
    } = orderData;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('products', sql.NVarChar, JSON.stringify(products)) 
            .input('total_price', sql.Decimal(18, 2), total_price)
            .input('points_earned', sql.Int, points_earned)
            .input('payment_method', sql.NVarChar, payment_method)
            .input('order_date', sql.DateTime, order_date)
            .query(`
                INSERT INTO Orders (user_id, products, total_price, points_earned, payment_method, order_date)
                OUTPUT INSERTED.id
                VALUES (@user_id, @products, @total_price, @points_earned, @payment_method, @order_date)
            `);

        console.log("Ordre oprettet succesfuldt:", result);
        return result.recordset[0].id;
    } catch (error) {
        console.error('Fejl ved oprettelse af ordre:', error);
        throw error;
    }
};

// Funktion til at oprette en ordre, der betales med loyalitetspoint
const createOrderWithLoyaltyPoints = async (orderData) => {
    console.log("createOrderWithLoyaltyPoints kaldt");

    const {
        user_id,
        products,
        total_price,
        payment_method,
        order_date
    } = orderData;

    try {
        const pool = await poolPromise;

        const result = await pool.request()
            .input('user_id', sql.Int, user_id)
            .input('products', sql.NVarChar, JSON.stringify(products))
            .input('total_price', sql.Decimal(18, 2), total_price)
            .input('points_earned', sql.Int, 0)
            .input('payment_method', sql.NVarChar, payment_method)
            .input('order_date', sql.DateTime, order_date)
            .query(`
                INSERT INTO Orders (user_id, products, total_price, points_earned, payment_method, order_date)
                OUTPUT INSERTED.id
                VALUES (@user_id, @products, @total_price, @points_earned, @payment_method, @order_date)
            `);

        console.log("Resultat af forespørgsel:", result);
        console.log("Ordre ID returneret:", result.recordset[0].id);

        return result.recordset[0].id;
    } catch (error) {
        console.error('Fejl ved oprettelse af ordre med loyalitetspoint:', error);
        throw error;
    }
};

// Funktion til at hente pointværdien for et produkt
const getProductPointsValue = async (productId) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('productId', sql.Int, productId)
        .query('SELECT points_value FROM Products WHERE id = @productId');

    return result.recordset[0].points_value;
};

// Funktion til at hente en bruger baseret på bruger-ID
const getUserById = async (userId) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('userId', sql.Int, userId)
        .query('SELECT * FROM Users WHERE user_id = @userId');

    return result.recordset[0];
};

// Funktion til at opdatere en brugers loyalitetspoint
const updateUserPoints = async (userId, newPoints) => {
    const pool = await poolPromise;

    await pool.request()
        .input('newPoints', sql.Int, newPoints)
        .input('userId', sql.Int, userId)
        .query('UPDATE Users SET loyalty_points = @newPoints WHERE user_id = @userId');
};

// Funktion til at hente et produkt-ID baseret på produktnavn
const getProductIdByName = async (productName) => {
    const pool = await poolPromise;

    const result = await pool.request()
        .input('productName', sql.NVarChar, productName)
        .query('SELECT id FROM Products WHERE name = @productName');

    return result.recordset.length ? result.recordset[0].id : null;
};

// Eksporterer funktionerne, så de kan bruges i andre dele af applikationen
module.exports = { 
    createOrder, 
    getUserById, 
    updateUserPoints, 
    getProductPointsValue, 
    createOrderWithLoyaltyPoints, 
    getProductIdByName 
};
