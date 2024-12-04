const { sql, getConnection } = require('../../config/db'); // Adjust based on the actual location of db.js

async function getAllProducts(req, res) {
  try {
      const pool = await getConnection();
      const result = await pool.request().query('SELECT * FROM dbo.Products');
      res.json(result.recordset); // Ensure points_value is included in the response
  } catch (err) {
      console.error("Error fetching products:", err);
      res.status(500).json({ error: "Could not fetch products" });
  }
}

module.exports = {
  getAllProducts
};
