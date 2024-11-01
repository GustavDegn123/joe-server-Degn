const { sql, getConnection } = require('../../../Downloads/joe-server-Degn 2/config/db'); // Importér både sql og getConnection

async function getAllProducts(req, res) {
  try {
    const pool = await getConnection(); // Brug den etablerede forbindelse
    const result = await pool.request().query('SELECT * FROM dbo.Products');
    console.log("Products fetched successfully:", result.recordset);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching products:", err);
    res.status(500).json({ error: "Could not fetch products" });
  }
}

module.exports = {
  getAllProducts
};
