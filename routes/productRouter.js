const express = require("express");
const router = express.Router();
// const {jwtAuthentication} = require('../middleware/jwtAuthentication')

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
  topTenSearchedProduct
} = require("../modules/product/productController");


/**
 * @swagger
 * components:
 *   schemas:
 *     products:
 *       type: object
 *       properties:
   *         name:
 *           type: string
 *           description: Product name
 *         price:
 *           type: number
 *           description: Product price
 *         description:
 *           type: string
 *           description: Product description
 *         quantity:
 *           type: number
 *           description: Product quantity
 *         product_type:
 *           type: string
 *           description: Product type
 *       required:
 *         - name
 *         - price
 *         - description
 *         - quantity
 *         - product_type
 *       example:
 *         name: Product Name
 *         price: 19.99
 *         description: Product Description
 *         quantity: 100
 *         product_type: Type
 */

/**
 * @swagger
 * tags:
 *   - name: Product
 *     description: Product all APIs
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     tags:
 *       - Product
 *     responses:
 *       '200':
 *         description: Product list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/products'
 *       '500':
 *         description: Internal server error

 * /products/add:
 *   post:
 *     summary: Add a new product
 *     tags:
 *       - Product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/products'
 *     responses:
 *       '200':
 *         description: Product added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/products'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/products'
 *       '500':
 *         description: Internal server error

 * /products/edit/{id}:
 *   put:
 *     summary: Update a product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/products'
 *     responses:
 *       '200':
 *         description: Product updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/products'
 *       '500':
 *         description: Internal server error

 * /products/delete/{id}:
 *   delete:
 *     summary: Delete a product by ID
 *     tags:
 *       - Product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Product deleted successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /products/outOfStock:
 *   get:
 *     summary: Get out of stock products
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: quantity
 *         schema:
 *           type: integer
 *         required: true
 *         description: The quantity threshold for out of stock products
 *     responses:
 *       '200':
 *         description: Out of stock products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/products'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /products/filter:
 *   get:
 *     summary: Filter products
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: product_type
 *         schema:
 *           type: string
 *         required: true
 *         description: The product type to filter by
 *     responses:
 *       '200':
 *         description: Products filtered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/products'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /products/sort:
 *   get:
 *     summary: Sort products
 *     tags:
 *       - Product
 *     responses:
 *       '200':
 *         description: Products sorted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/products'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /products/search:
 *   get:
 *     summary: Search products
 *     tags:
 *       - Product
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         required: true
 *         description: The name of the product to search for
 *     responses:
 *       '200':
 *         description: Products searched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/products'
 *       '500':
 *         description: Internal server error 
 */

/**
 * @swagger
 * /products/topTenSearchedProduct:
 *   get:
 *     summary: Get the top 10 most searched products
 *     tags:
 *       - Product
 *     responses:
 *       '200':
 *         description: Top 10 most searched products retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/products'
 *       '500':
 *         description: Internal server error
 */




router.route("/topTenSearchedProduct").get(topTenSearchedProduct);
router.route("/outOfStock").get(outOfStockProduct);
router.route("/filter").get(filterProduct);
router.route("/sort").get(sortProduct);
router.route("/search").get(searchProduct);
router.route("/").get( getAllProducts);
router.route("/:id").get(getProduct);
router.route("/add").post(addProduct);
router.route("/edit/:id").put(editProduct);
router.route("/delete/:id").delete(deleteProduct);


module.exports = router;
