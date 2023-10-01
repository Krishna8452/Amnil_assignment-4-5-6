const carts = require("../models/cartModel")
const orders = require("../models/orderModel")

exports.checkout = async (req, res) => {
    try{
        const cartId = req.params.cartId
        const cartToAdd = await carts.findById(cartId)
        if(!cartToAdd){
            res.status(404).json({message:"no cart item found"})
        }else{
            const orderToAdd = {
            cartId,
            userId: cartToAdd.userId,
            items: cartToAdd.items,
            price: cartToAdd.price
            };
            const added = await orders.create(orderToAdd)
            res.json({added, success:'cart checkout successfully'});
        }
    }catch(error){
    res.status(500).json({ error: "failed to checkout the cart item" });
    }
}

exports.getOrders = async (req, res) => {
    try{
        const allOrderedData = await orders.find({})
        res.status(200).json({allOrderedData, success:"all orderd data are listed above"});
    }catch(error){
        res.status(500).json({error:"failed to listout all orders"})
    }
}

exports.getOrderById = async (req, res) => {
    try{
        const orderId = req.params.id;
        const orderDataById = await orders.findById(orderId)
        if(orderDataById){
            res.status(200).json({orderDataById, success:" order data by id found"});
        }else{
            res.status(404).json({message:'order not found in the list'})
        }
    }catch(error){
        res.status(500).json({error:"failed to get order"})
    }
}

exports.deleteOrderById = async (req, res) =>{
    try {
        const deleteId = req.params.id;
        const deletedOrder = await orders.findByIdAndRemove(deleteId);
        if (!deletedOrder) {
          return res.status(404).json({ message: 'Order not found' });
        }
        res.status(200).json({ message: 'Order deleted successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
      }
}