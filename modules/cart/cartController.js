const pool = require("../../db/db");

exports.addToCart = async (req, res) => {
  const { items } = req.body;
  const userId = parseInt(req.body.userId);

  try {
    const userExistsResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (userExistsResult.rowCount === 0) {
      return res.status(404).send("User not found");
    }

    const cartExistsResult = await pool.query(
      "SELECT * FROM carts WHERE user_id = $1",
      [userId]
    );

    if (cartExistsResult.rowCount > 0) {
      const cartId = cartExistsResult.rows[0].id;

      for (const item of items) {
        const productDetailsResult = await pool.query(
          "SELECT * FROM products WHERE id = $1",
          [item.productId]
        );

        if (productDetailsResult.rowCount === 0) {
          return res.status(404).send("Product not found");
        }

        const productDetails = productDetailsResult.rows[0];

        if (productDetails.quantity < item.quantity) {
          return res.status(400).send("Product quantity is not available");
        }

        const existingProduct = await pool.query(
          "SELECT * FROM carts_products WHERE cart_id = $1 AND product_id = $2",
          [cartId, item.productId]
        );

        if (existingProduct.rowCount > 0) {
          const existingProductData = existingProduct.rows[0];
          const newQuantity = existingProductData.quantity + item.quantity;
          const newPrice = newQuantity * productDetails.price;

          await pool.query(
            "UPDATE carts_products SET quantity = $1, price = $2 WHERE cart_id = $3 AND product_id = $4",
            [newQuantity, newPrice, cartId, item.productId]
          );
        } else {
          const newPrice = item.quantity * productDetails.price;
          await pool.query(
            "INSERT INTO carts_products (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
            [cartId, item.productId, item.quantity, newPrice]
          );
        }
      }

      const updatedTotalPriceQuery =
        "SELECT SUM(price) AS total_price FROM carts_products WHERE cart_id = $1";
      const updatedTotalPriceResult = await pool.query(updatedTotalPriceQuery, [cartId]);

      const updatedTotalPrice = updatedTotalPriceResult.rows[0].total_price;

      const updateCartQuery = "UPDATE carts SET total_price = $1 WHERE id = $2";
      await pool.query(updateCartQuery, [updatedTotalPrice, cartId]);

      res.send("Cart updated successfully");
    } else {
      let total_price = 0;

      const insertCartResult = await pool.query(
        "INSERT INTO carts (user_id, total_price) VALUES ($1, $2) RETURNING id",
        [userId, total_price]
      );

      for (const item of items) {
        const productDetailsResult = await pool.query(
          "SELECT * FROM products WHERE id = $1",
          [item.productId]
        );

        if (productDetailsResult.rowCount === 0) {
          return res.status(404).send("Product not found");
        }

        const productDetails = productDetailsResult.rows[0];

        if (productDetails.quantity < item.quantity) {
          return res.status(400).send("Product quantity is not available");
        }

        const newPrice = item.quantity * productDetails.price;
        total_price += newPrice;

        await pool.query(
          "INSERT INTO carts_products (cart_id, product_id, quantity, price) VALUES ($1, $2, $3, $4)",
          [insertCartResult.rows[0].id, item.productId, item.quantity, newPrice]
        );
      }

      await pool.query(
        "UPDATE carts SET total_price = $1 WHERE id = $2",
        [total_price, insertCartResult.rows[0].id]
      );

      res.send("New cart created with ID: " + insertCartResult.rows[0].id);
    }
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};


exports.removeFromCart = async (req, res) => {
  const userId = parseInt(req.query.userId);
  const productId = parseInt(req.query.productId);

  if (isNaN(userId) || isNaN(productId)) {
    return res.status(400).send("Invalid userId or productId");
  }

  try {
    const userExistsResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (userExistsResult.rowCount === 0) {
      return res.status(404).send("User not found");
    }

    const cartExistsResult = await pool.query(
      "SELECT * FROM carts WHERE user_id = $1",
      [userId]
    );

    if (cartExistsResult.rowCount === 0) {
      return res.status(404).send("Cart not found");
    }

    const cartId = cartExistsResult.rows[0].id;

    const existingProduct = await pool.query(
      "SELECT * FROM carts_products WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    if (existingProduct.rowCount === 0) {
      return res.status(404).send("Product not found in the cart");
    }

    await pool.query(
      "DELETE FROM carts_products WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    const updatedTotalPriceQuery =
      "SELECT SUM(price) AS total_price FROM carts_products WHERE cart_id = $1";
    const updatedTotalPriceResult = await pool.query(updatedTotalPriceQuery, [cartId]);
    const updatedTotalPrice = updatedTotalPriceResult.rows[0].total_price;

    await pool.query("UPDATE carts SET total_price = $1 WHERE id = $2", [updatedTotalPrice, cartId]);

    res.send("Product removed from the cart, and cart updated");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};


