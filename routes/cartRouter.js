const express = require("express");
const router = express.Router();
const {basicAuthentication} = require('../middleware/basicAuthentication')

const { addToCart, getAllCart, getCartById}  = require("../modules/cart/cartController");

 router.route('/add').post(addToCart)
 router.route('/').get(basicAuthentication, getAllCart)
 router.route('/:id').get(getCartById)

 module.exports = router;