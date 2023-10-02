const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
    ref:'users'
  },
  cartId: {
    type: mongoose.Types.ObjectId,
    required: true,
  },
  items: [
    {
      productId: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref:'products'
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  price: {
    type: Number,
    default: 0,
  }
}, {
  timestamps: true 
});

const orders = mongoose.model('orders', orderSchema);

module.exports = orders;
