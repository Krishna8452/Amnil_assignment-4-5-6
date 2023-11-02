const pool = require("../../db/db");

exports.addToCart = async (req, res) => {
  const { userId, items } = req.body;

  try {
    const existingCartQuery = "SELECT * FROM carts WHERE user_id = $1";
    const { rows: existingCartRows } = await pool.query(existingCartQuery, [
      userId,
    ]);

    if (existingCartRows.length > 0) {
      let updatedItems = [...existingCartRows[0].items];

      for (const newItem of items) {
        const existingItem = updatedItems.find(
          (item) => item.product_id === newItem.productId
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          updatedItems.push(newItem);
        }
      }

      let totalPrice = 0;
      for (const item of updatedItems) {
        const productQuery = "SELECT * FROM products WHERE id = $1";
        const { rows: productRows } = await pool.query(productQuery, [
          item.productId,
        ]);

        if (productRows.length === 0) {
          return res.status(404).json({ error: "Product not found" });
        }

        const product = productRows[0];
        totalPrice += product.price * item.quantity;
      }

      const updateCartQuery =
        "UPDATE carts SET items = $1, price = $2 WHERE user_id = $3";
      await pool.query(updateCartQuery, [
        updatedItems,
        totalPrice.toFixed(2),
        userId,
      ]);

      res.status(200).json({updatedItems, success: "Cart updated successfully" });
    } else {
      let totalPrice = 0;
      for (const item of items) {
        const productQuery = "SELECT * FROM products WHERE id = $1";
        const { rows: productRows } = await pool.query(productQuery, [
          item.productId,
        ]);

        if (productRows.length === 0) {
          return res.status(404).json({ error: "Product not foundd" });
        }

        const product = productRows[0];
        totalPrice += product.price * item.quantity;
      }

      const cartData = {
        user_id: userId,
        items,
        price: totalPrice.toFixed(2),
      };

      const insertCartQuery =
        "INSERT INTO carts (user_id, items, price) VALUES ($1, $2, $3)";
      await pool.query(insertCartQuery, [
        cartData.user_id,
        cartData.items,
        cartData.price,
      ]);

      res
        .status(200)
        .json({ success: "Cart created successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: " server error" });
  }
};

exports.getAllCart = async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM carts');

    if (rows.length > 0) {
      res.status(200).json({ allCarts: rows, message: "all data of carts are fetched successfully" });
    } else {
      res.status(404).json({ message: "no cart found" });
    }
  } catch (error) {
    res.status(500).json({ error: "error occurred" });
  }
};


exports.getCartById = async (req, res) => {
  try {
    const cartId = req.params.id;
    const query = 'SELECT * FROM carts WHERE id = $1';

    const { rows } = await pool.query(query, [cartId]);

    if (rows.length > 0) {
      res.status(200).json({ singleCart: rows[0], success: 'cart data by ID fetched successfully' });
    } else {
      res.status(404).json({ failed: 'the ID you entered does not contain any cart item' });
    }
  } catch (error) {
    res.status(500).json({ error: "error occurred" });
  }
};

exports.deleteCart = async (req, res) => {
  try{
    const cartIdToDelete = req.params.id;
    if(!cartIdToDelete){
      return res.status(404).json({ message:"cart id not found"})
    }
    const deletedCart = await pool.query("DELETE FROM carts WHERE id = $1",[cartIdToDelete]);
    res.status(200).json({deletedCart, message:"the cart is deleted successfully", deletedCart})
  }catch(error){
    res.status(500).json({error:"server error"})
  }
}
