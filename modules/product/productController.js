const pool = require('../../db/db');

exports.getAllProducts = async (req, res) => {
  try {
    const query = 'SELECT * FROM products'; 
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const query = 'SELECT * FROM products WHERE id = $1'; 
    const { rows } = await pool.query(query, [productId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.addProduct = async (req, res) => {
  const newProduct = req.body;
  try {
    const {id, name, description, price, quantity, product_type } = newProduct;
    const insertQuery = 'INSERT INTO products (id, name, description, price, quantity, product_type) VALUES ($1, $2, $3, $4, $5, $6)'; 
    await pool.query(insertQuery, [id, name, description, price, quantity, product_type]);
    res.status(200).json({ success: 'Product created successfully!!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.editProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const updates = req.body;
    const updateQuery = 'UPDATE products SET name = $1, description = $2, price = $3, quantity = $4, product_type = $5 WHERE id = $6';
    const { rowCount } = await pool.query(updateQuery, [
      updates.name,
      updates.description,
      updates.price,
      updates.quantity,
      updates.product_type,
      productId,
    ]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ success: 'Product updated successfully!!' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const deleteQuery = 'DELETE FROM products WHERE id = $1'; 
    const { rowCount } = await pool.query(deleteQuery, [productId]);
    if (rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.outOfStockProduct = async (req, res) => {
  try {
    const quant = req.query.quantity;
    const query = 'SELECT * FROM products WHERE quantity < $1'; 
    const { rows } = await pool.query(query, [quant]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.filterProduct = async (req, res) => {
  try {
    const value = req.query.product_type;
    const valuee = value.toLowerCase();
    const query = 'SELECT * FROM products WHERE LOWER(product_type) = $1';
    const { rows } = await pool.query(query, [valuee]);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.sortProduct = async (req, res) => {
  try {
    const query = 'SELECT * FROM products ORDER BY price';
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// exports.searchProduct = async (req, res) => {
//   try {
//     const query = req.query.name;
//     const searchParam = `%${query}%`;
//     const queryText = 'SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1'; 
//     const { rows } = await pool.query(queryText, [searchParam]);
//     res.json(rows);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Server error' });
//   }
// };

exports.searchProduct = async (req, res) => {
  try {
    const query = req.query.name;
    const searchParam = `%${query}%`;
    const queryText = 'SELECT * FROM products WHERE name ILIKE $1 OR description ILIKE $1';
    
    // Execute the search query
    const { rows } = await pool.query(queryText, [searchParam]);
    
    // Insert search history data
    for (const row of rows) {
      const insertHistoryQuery = 'INSERT INTO searchHistory (productId, searchCount) VALUES ($1, 1) ON CONFLICT (productId) DO UPDATE SET searchCount = searchHistory.searchCount + 1';
      await pool.query(insertHistoryQuery, [row.id]);
    }

    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.topTenSearchedProduct = async (req, res) => {
  try {
    const queryText = `
      SELECT sh.productid, sh.searchCount, p.name, p.price, p.description, p.quantity, p.product_type
      FROM searchHistory sh
      INNER JOIN products p ON sh.productid = p.id
      ORDER BY sh.searchCount DESC
      LIMIT 10;
    `;
    const { rows } = await pool.query(queryText);
    res.status(200).json({ success: "Top 10 most searched result:", rows });
  } catch (error) {
    console.error(error); // Log the error message to the console
    res.status(500).json({ error: "Internal server error" });
  }
};



