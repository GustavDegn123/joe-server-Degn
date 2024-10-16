const { getConnection, sql } = require('../config/db');

exports.createUser = async (name, email, password_hash) => {
    const pool = await getConnection();
    return pool.request()
        .input('name', sql.NVarChar, name)
        .input('email', sql.NVarChar, email)
        .input('password_hash', sql.NVarChar, password_hash)
        .query('INSERT INTO dbo.Users (name, email, password_hash) VALUES (@name, @email, @password_hash)');
};
