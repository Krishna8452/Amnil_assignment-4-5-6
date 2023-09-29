const express = require("express");
const router = express.Router();

const {addToCart, getOrders, getOrderById, checkout} = require("../controller/order");

router.route('/').get(getOrders)
router.route('/:id').get(getOrderById)
router.route('/cart/addToCart').post(addToCart)
router.route('/cart/checkout/:cartId').post(checkout)

module.exports = router