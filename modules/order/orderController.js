const { response } = require("express");
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
      const updatedTotalPriceResult = await pool.query(updatedTotalPriceQuery, [
        cartId,
      ]);

      const updatedTotalPrice = updatedTotalPriceResult.rows[0].total_price;

      const updateCartQuery = "UPDATE carts SET total_price = $1 WHERE id = $2";
      await pool.query(updateCartQuery, [updatedTotalPrice, cartId]);

      res.status(200).json({success:"Cart updated successfully",});
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

      await pool.query("UPDATE carts SET total_price = $1 WHERE id = $2", [
        total_price,
        insertCartResult.rows[0].id,
      ]);

      res.send("product added to cart successfully: ");
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
    const updatedTotalPriceResult = await pool.query(updatedTotalPriceQuery, [
      cartId,
    ]);
    const updatedTotalPrice = updatedTotalPriceResult.rows[0].total_price;

    await pool.query("UPDATE carts SET total_price = $1 WHERE id = $2", [
      updatedTotalPrice,
      cartId,
    ]);

    res.send("Product removed from the cart, and cart updated");
  } catch (error) {
    res.status(500).send("Internal Server Error");
  }
};

exports.checkout = async (req, res) => {
  const userId = parseInt(req.query.userId);
  const cartId = parseInt(req.query.cartId);
  const query = "SELECT * FROM carts WHERE user_id = $1 AND id = $2";
  const userCartData = await pool.query(query, [userId, cartId]);
  if (userCartData.rowCount === 0) {
    return res
      .status(404)
      .json({ message: "carts for this user not found !!!" });
  }
  const userCart = userCartData.rows[0];
  const cartProduct = await pool.query(
    "SELECT cp.quantity, cp.price, p.id, p.name FROM carts_products cp JOIN products p ON CP.product_id = p.id  WHERE cp.cart_id =$1",
    [userCart.id]
  );
  userCart.products = cartProduct.rows;
  if (userCart.total_price < 500) {
    return res.status(400).json({
      message: "The must be minimum of cart price Rs 500 to get checked out",
    });
  }

  const order = await pool.query(
    "INSERT INTO orders (user_id, total_price) VALUES($1, $2) RETURNING *",
    [userId, userCart.total_price]
  );
  const orderId = order.rows[0].id;
  for (const product of userCart.products) {
    const productDetails = await pool.query(
      "SELECT * FROM products WHERE id = $1",
      [product.id]
    );
    if (productDetails.rowCount === 0) {
      return res.status(400).json({ message: "product not found" });
    }
    const productDetailsRow = productDetails.rows[0];
    if (productDetailsRow) {
      productDetailsRow.quantity -= product.quantity;
      if (productDetailsRow.quantity < product.quantity) {
        res.status(400).json({ message: "product out of stock" });
      }
      await pool.query("UPDATE products SET quantity = $1 WHERE id = $2", [
        productDetailsRow.quantity,
        product.id,
      ]);
      await pool.query(
        "INSERT INTO orders_products (order_id, product_id, quantity, price) VALUES($1, $2, $3, $4)",
        [orderId, product.id, product.quantity, product.price]
      );
    } else {
      return res.status(404).json({ message: "product not found" });
    }
    await pool.query('DELETE FROM carts_products WHERE cart_id = $1', [cartId]);
    await pool.query('DELETE FROM carts WHERE user_id = $1', [userId]);
  }
  res.status(200).json({userCart, message: "cart checked out successfully" });
};

exports.getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT
        o.id AS order_id,
        o.user_id,
        o.total_price AS order_total_price,
        o.created_at AS order_created_at,
        op.product_id,
        op.quantity AS product_quantity,
        p.name AS product_name,
        p.price AS product_price
      FROM orders o
      JOIN orders_products op ON o.id = op.order_id
      JOIN products p ON op.product_id = p.id
    `;

    const result = await pool.query(query);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No orders found" });
    }

    const ordersWithProducts = [];

    for (const row of result.rows) {
      const existingOrder = ordersWithProducts.find((order) => order.order_id === row.order_id);

      if (existingOrder) {
        existingOrder.products.push({
          product_id: row.product_id,
          product_name: row.product_name,
          product_quantity: row.product_quantity,
          product_price: row.product_price,
        });
      } else {
        ordersWithProducts.push({
          order_id: row.order_id,
          user_id: row.user_id,
          order_total_price: row.order_total_price,
          order_created_at: row.order_created_at,
          products: [
            {
              product_id: row.product_id,
              product_name: row.product_name,
              product_quantity: row.product_quantity,
              product_price: row.product_price,
            },
          ],
        });
      }
    }

    return res.status(200).json({success:"order list fetched successfully",ordersWithProducts});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.viewOrderOfUser = async (req, res) => {
  const userId = parseInt(req.params.id);
  try {
    const userExistsResult = await pool.query(
      "SELECT * FROM users WHERE id = $1",
      [userId]
    );

    if (userExistsResult.rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const query = `
      SELECT
        o.id AS order_id,
        o.user_id,
        o.total_price AS order_total_price,
        o.created_at AS order_created_at,
        op.product_id,
        op.quantity AS product_quantity,
        p.name AS product_name,
        p.price AS product_price
      FROM orders o
      JOIN orders_products op ON o.id = op.order_id
      JOIN products p ON op.product_id = p.id
      WHERE o.user_id = $1
    `;

    const result = await pool.query(query, [userId]);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "No orders found for the user" });
    }

    const ordersWithProducts = [];

    for (const row of result.rows) {
      const existingOrder = ordersWithProducts.find((order) => order.order_id === row.order_id);

      if (existingOrder) {
        existingOrder.products.push({
          product_id: row.product_id,
          product_name: row.product_name,
          product_quantity: row.product_quantity,
          product_price: row.product_price,
        });
      } else {
        ordersWithProducts.push({
          order_id: row.order_id,
          user_id: row.user_id,
          order_total_price: row.order_total_price,
          order_created_at: row.order_created_at,
          products: [
            {
              product_id: row.product_id,
              product_name: row.product_name,
              product_quantity: row.product_quantity,
              product_price: row.product_price,
            },
          ],
        });
      }
    }

    return res.status(200).json(ordersWithProducts);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
  res.json(userId)
};


exports.totalRevenue = async (req, res) => {
  let startDate = req.query.startDate;
  let endDate = req.query.endDate;

  if (startDate && endDate) {
    startDate = new Date(startDate);
    endDate = new Date(endDate);
    startDate.setUTCHours(0, 0, 0, 0);
    endDate.setUTCHours(0, 0, 0, 0);

    const query = `
      SELECT
          SUM(op.total_price) AS total_revenew
          FROM orders o
          LEFT JOIN (
              SELECT op.order_id, SUM(op.price) AS total_price
                      FROM orders_products op
                  GROUP BY op.order_id
              ) op ON o.id = op.order_id
          WHERE DATE(o.created_at) BETWEEN $1 AND $2
  `;

    const totalRevenue = await pool.query(query, [
      startDate.toISOString(),
      endDate.toISOString(),
    ]);

    if (totalRevenue.rowCount === 0) {
      return res.status(404).send("No orders found for the date");
    }

    return res.send(totalRevenue.rows);
  }

  const query = `
      SELECT
          SUM(op.total_price) AS total_revenew
          FROM orders o
          LEFT JOIN (
              SELECT op.order_id, SUM(op.price) AS total_price
                      FROM orders_products op
                  GROUP BY op.order_id
              ) op ON o.id = op.order_id
  `;

  const totalRevenue = await pool.query(query);

  if (totalRevenue.rowCount === 0) {
    return res.status(404).send("No orders found");
  }

  return res.send(totalRevenue.rows);
};


exports.topSoldProducts = async (req, res) => {
  try {
    const query = `
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        SUM(op.quantity) AS total_sold_quantity
      FROM products p
      LEFT JOIN orders_products op ON p.id = op.product_id
      GROUP BY p.id, p.name
      HAVING SUM(op.quantity) > 0  -- Exclude products with no sales
      ORDER BY total_sold_quantity DESC  -- Order by total sold quantity in descending order
      LIMIT 10
    `;

    const topSellingProduct = await pool.query(query);

    if (topSellingProduct.rowCount === 0) {
      return res.status(404).json({ message: "No products found or no sales data available" });
    }

    return res.status(200).json(topSellingProduct.rows);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};


exports.getTotalProductSales = async (req, res) => {
  const { startDate, endDate } = req.query;

  try {
    const query = `
      SELECT
        p.id AS product_id,
        p.name AS product_name,
        COUNT(op.id) AS product_count
      FROM orders o
      JOIN orders_products op ON o.id = op.order_id
      JOIN products p ON op.product_id = p.id
      WHERE DATE(o.created_at) BETWEEN $1 AND $2
      GROUP BY p.id, p.name
    `;

    const soldProducts = await pool.query(query, [startDate, endDate]);

    if (soldProducts.rowCount === 0) {
      return res.status(404).json({ message: "No sales data available within the specified date range" });
    }

    return res.status(200).json(soldProducts.rows);
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};





