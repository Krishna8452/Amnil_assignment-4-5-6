const express = require("express");
const router = express.Router();

const { addToCart, getAllCart, getCartById}  = require("../controller/carts");


 router.route('/add').post(addToCart)
 router.route('/').get(getAllCart)
 router.route('/:id').get(getCartById)

 module.exports = router;