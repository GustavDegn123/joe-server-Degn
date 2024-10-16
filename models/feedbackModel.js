const { getConnection, sql } = require("../config/db");

// Model-funktion til at gemme feedback
exports.insertFeedback = async (user_id, feedback_text) => {
    try {
        const pool = await getConnection(); // Opret forbindelse til databasen
        await pool.request()
            .input('user_id', sql.Int, user_id) // Brugerens ID
            .input('feedback_text', sql.NVarChar, feedback_text) // Feedback-tekst
            .query('INSERT INTO Feedback (user_id, feedback_text) VALUES (@user_id, @feedback_text)'); // SQL-forespørgsel
    } catch (error) {
        throw new Error('Error inserting feedback into the database');
    }
};
