
const carts = require("../../models/cartModel");
const products = require("../../models/productModel");

exports.addToCart = async (req, res) => {
  const { userId, items } = req.body;

  try {
    const existingCart = await carts.findOne({ userId });

    if (existingCart) {
      let updatedItems = [...existingCart.items];

      for (const newItem of items) {
        const existingItem = updatedItems.find(
          (item) => item.productId == newItem.productId
        );

        if (existingItem) {
          existingItem.quantity += newItem.quantity;
        } else {
          updatedItems.push(newItem);
        }
      }

      let totalPrice = 0; 
      for (const item of updatedItems) {
        const product = await products.findById(item.productId);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        totalPrice += product.price * item.quantity;
      }

      await carts.updateOne(
        { userId },
        {
          $set: {
            items: updatedItems,
            price: totalPrice.toFixed(2),
          },
        }
      );

      res.status(200).json({ success: "Cart updated successfully" });
    } else {
      let totalPrice = 0;
      for (const item of items) {
        const product = await products.findById(item.productId);
        if (!product) {
          return res.status(404).json({ error: "Product not found" });
        }
        totalPrice += product.price * item.quantity;
      }
      const cartData = {
        userId,
        items,
        price: totalPrice.toFixed(2),
      };
      await carts.create(cartData);
      res.status(200).json({ success: "Cart created successfully" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Could not update cart" });
  }
};

exports.getAllCart = async (req, res) =>{
    try{
        const allCarts = await carts.find({})
        .populate('userId')
        .populate('items.productId');
        if(allCarts){
            res.status(200).json({allCarts , message:"all data of carts are fetched successfully"})
        }
        else{
            res.status(404).json({message:"no cart found"})
        }
    }catch (error) {
        res.status(500).json({ error: "error occured" });
    }
}

exports.getCartById = async (req, res) =>{
    try{
        const cartId = req.params.id
        const singleCart = await carts.findById(cartId)
        if(singleCart){
            res.status(200).json({singleCart, success:'cart data by id fetched successfully'})
        }else{
            res.status(404).json({failed:'the id you entered does not contain any cart item '})
        }
    }catch(error){
        res.status(500).json({error:"error occured"})
    }
}
