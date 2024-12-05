// Importerer databaseforbindelsen
const { getConnection } = require('../../config/db');

// Funktion til at oprette en ny ordre i databasen
const createOrder = async (orderData) => {
    console.log("Opretter ordre i databasen:", orderData);

    // Destrukturerer ordredata fra input
    const {
        user_id,
        products,
        total_price,
        points_earned,
        payment_method,
        order_date
    } = orderData;

    try {
        // Opretter forbindelse til databasen
        const pool = await getConnection();

        // Indsætter ordredata i databasen og returnerer det indsatte ordres ID
        const result = await pool.request()
            .input('user_id', user_id)
            .input('products', JSON.stringify(products)) // Konverterer produktlisten til JSON
            .input('total_price', total_price)
            .input('points_earned', points_earned)
            .input('payment_method', payment_method)
            .input('order_date', order_date)
            .query(`
                INSERT INTO Orders (user_id, products, total_price, points_earned, payment_method, order_date)
                OUTPUT INSERTED.id
                VALUES (@user_id, @products, @total_price, @points_earned, @payment_method, @order_date)
            `);

        console.log("Ordre oprettet succesfuldt:", result);
        return result.recordset[0].id; // Returnerer det indsatte ordres ID
    } catch (error) {
        // Logger fejl og smider en undtagelse
        console.error('Fejl ved oprettelse af ordre:', error);
        throw error;
    }
};

// Funktion til at oprette en ordre, der betales med loyalitetspoint
const createOrderWithLoyaltyPoints = async (orderData) => {
    console.log("createOrderWithLoyaltyPoints kaldt");

    // Destrukturerer ordredata fra input
    const {
        user_id,
        products,
        total_price,
        payment_method,
        order_date
    } = orderData;

    try {
        // Opretter forbindelse til databasen
        const pool = await getConnection();

        // Indsætter ordredata i databasen med 0 point optjent
        const result = await pool.request()
            .input('user_id', user_id)
            .input('products', JSON.stringify(products))
            .input('total_price', total_price)
            .input('points_earned', 0)
            .input('payment_method', payment_method)
            .input('order_date', order_date)
            .query(`
                INSERT INTO Orders (user_id, products, total_price, points_earned, payment_method, order_date)
                OUTPUT INSERTED.id
                VALUES (@user_id, @products, @total_price, @points_earned, @payment_method, @order_date)
            `);

        console.log("Resultat af forespørgsel:", result);
        console.log("Ordre ID returneret:", result.recordset[0].id);

        return result.recordset[0].id;
    } catch (error) {
        // Logger fejl og smider en undtagelse
        console.error('Fejl ved oprettelse af ordre med loyalitetspoint:', error);
        throw error;
    }
};

// Funktion til at hente pointværdien for et produkt
const getProductPointsValue = async (productId) => {
    // Opretter forbindelse til databasen
    const pool = await getConnection();

    // Henter pointværdien for produktet fra databasen
    const result = await pool.request()
        .input('productId', productId)
        .query('SELECT points_value FROM Products WHERE id = @productId');

    return result.recordset[0].points_value; // Returnerer pointværdien
};

// Funktion til at hente en bruger baseret på bruger-ID
const getUserById = async (userId) => {
    // Opretter forbindelse til databasen
    const pool = await getConnection();

    // Henter brugerdata baseret på bruger-ID
    const result = await pool.request()
        .input('userId', userId)
        .query('SELECT * FROM Users WHERE user_id = @userId');

    return result.recordset[0]; // Returnerer brugeren
};

// Funktion til at opdatere en brugers loyalitetspoint
const updateUserPoints = async (userId, newPoints) => {
    // Opretter forbindelse til databasen
    const pool = await getConnection();

    // Opdaterer loyalitetspoint for brugeren
    await pool.request()
        .input('newPoints', newPoints)
        .input('userId', userId)
        .query('UPDATE Users SET loyalty_points = @newPoints WHERE user_id = @userId');
};

// Funktion til at hente et produkt-ID baseret på produktnavn
const getProductIdByName = async (productName) => {
    // Opretter forbindelse til databasen
    const pool = await getConnection();

    // Henter produkt-ID baseret på produktnavn
    const result = await pool.request()
        .input('productName', productName)
        .query('SELECT id FROM Products WHERE name = @productName');
    
    return result.recordset.length ? result.recordset[0].id : null; // Returnerer produkt-ID eller null
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