const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
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
    },{_id: false},
  ],
  price: {
    type: Number,
    default: 0,
  },
},{
  timestamps: true
});

const carts = mongoose.model('carts', cartSchema);

module.exports = carts;
