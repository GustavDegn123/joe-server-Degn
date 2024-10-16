const { getConnection, sql } = require("../config/db"); // Forbindelse til din database

// Model-funktion til at hente onboarding-status fra databasen
exports.getOnboardingStatus = async (userId) => {
    try {
        const pool = await getConnection(); // Opret forbindelse til databasen
        const result = await pool.request()
            .input('userId', sql.Int, userId) // Brug userId som input
            .query('SELECT * FROM OnboardingProgress WHERE user_id = @userId'); // SQL-forespørgsel

        return result.recordset; // Returner dataene
    } catch (error) {
        throw new Error('Error fetching onboarding status');
    }
};

// Model-funktion til at opdatere onboarding-trin
exports.completeStep = async (user_id, step_number, step_description, completed_at) => {
    try {
        const pool = await getConnection(); // Opret forbindelse til databasen
        await pool.request()
            .input('user_id', sql.Int, user_id) // Brugerens ID
            .input('step_number', sql.Int, step_number) // Trinnets nummer
            .input('step_description', sql.NVarChar, step_description) // Beskrivelse af trinnet
            .input('completed_at', sql.DateTime, completed_at) // Tidspunkt for færdiggørelse
            .query('INSERT INTO OnboardingProgress (user_id, step_number, step_description, completed_at) VALUES (@user_id, @step_number, @step_description, @completed_at)'); // SQL-forespørgsel
    } catch (error) {
        throw new Error('Error completing onboarding step');
    }
};
