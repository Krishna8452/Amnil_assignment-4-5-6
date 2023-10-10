const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          required: true,
          ref: "products",
        },
        quantity: {
          type: Number,
          required: true,
        },
      },
      { _id: false },
    ],
    price: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const carts = mongoose.model("carts", cartSchema);

module.exports = carts;
