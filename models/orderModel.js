const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Types.ObjectId,
    required: true,
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
