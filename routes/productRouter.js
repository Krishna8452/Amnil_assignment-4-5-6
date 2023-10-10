const express = require("express");
const router = express.Router();
const {jwtAuthentication} = require('../middleware/jwtAuthentication')

const {
  getAllProducts,
  getProduct,
  addProduct,
  editProduct,
  deleteProduct,
  outOfStockProduct,
  filterProduct,
  sortProduct,
  searchProduct,
} = require("../modules/product/productController");

router.route("/outOfStock").get(outOfStockProduct);
router.route("/filter").get(filterProduct);
router.route("/sort").get(sortProduct);
router.route("/search").get(searchProduct);
router.route("/").get(jwtAuthentication, getAllProducts);
router.route("/:id").get(getProduct);
router.route("/add").post(addProduct);
router.route("/edit/:id").put(editProduct);
router.route("/delete/:id").delete(deleteProduct);

module.exports = router;
