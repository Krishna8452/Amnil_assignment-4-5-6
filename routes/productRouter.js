const express = require("express");
const router = express.Router();

const { getAllProducts, getProduct, addProduct, editProduct, deleteProduct, outOfStockProduct, filterProduct, sortProduct , searchProduct}  = require("../controller/products");


 router.route('/').get(getAllProducts)
 router.route('/:id').get(getProduct)
 router.route('/add').post(addProduct)
 router.route('/edit/:id').put(editProduct)
 router.route('/delete/:id').delete(deleteProduct)
 router.route('/prod/outOfStock').get(outOfStockProduct)
 router.route('/prod/filter').get(filterProduct)
 router.route('/prod/sort').get(sortProduct)
 router.route('/prod/search').get(searchProduct)

 


 module.exports = router;