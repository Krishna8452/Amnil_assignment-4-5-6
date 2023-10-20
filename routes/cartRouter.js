const express = require("express");
const router = express.Router();
const { basicAuthentication } = require("../middleware/basicAuthentication");

const {
  addToCart,
  getAllCart,
  getCartById,
  deleteCart
} = require("../modules/cart/cartController");

router.route("/add").post(addToCart);
router.route("/").get( getAllCart);
router.route("/:id").get(getCartById);
router.route("/delete/:id").delete(deleteCart);
module.exports = router;
