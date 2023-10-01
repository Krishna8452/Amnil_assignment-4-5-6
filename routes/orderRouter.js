const express = require("express");
const router = express.Router();

const {getOrders, getOrderById, checkout, deleteOrderById} = require("../controller/orders");

router.route('/checkout/:cartId').post(checkout)
router.route('/').get(getOrders)
router.route('/:id').get(getOrderById)
router.route('/delete/:id').delete(deleteOrderById)

module.exports = router