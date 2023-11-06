const express = require("express");
const router = express.Router();

const {
  addToCart,
  removeFromCart,
  checkout,
  totalRevenue,
  getAllOrders,
  viewOrderOfUser,
  topSoldProducts,
  getTotalProductSales
} = require("../modules/order/orderController");


/**
 * @swagger
 * components:
 *   schemas:
 *     orders:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user who owns the order.
 *         items:
 *           type: array
 *           description: An array of items in the order.
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product in the order.
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product in the cart.
 *         price:
 *           type: number
 *           description: The total price of the cart.
 *           default: 0
 *       example:
 *         userId: "5f8a2b9a3deac124c82294e0"
 *         items:
 *           - productId: "5f8a2b9a3deac124c82294e2"
 *             quantity: 3
 */

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Cart-related APIs
 */

/**
 * @swagger
 * /orders/addtocart:
 *   post:
 *     summary: Add items to a shopping cart
 *     tags:
 *       - Order
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/orders'
 *     responses:
 *       '200':
 *         description: Items added to the order successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/orders'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /orders/removeFromCart:
 *   delete:
 *     summary: Remove a product from the shopping cart
 *     tags:
 *       - Order
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user who owns the cart.
 *       - in: query
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the product to be removed from the cart.
 *     responses:
 *       '200':
 *         description: Product removed from the cart successfully
 *       '400':
 *         description: Bad request. Invalid input data.
 *       '404':
 *         description: Not found. The specified product or cart does not exist.
 *       '500':
 *         description: Internal Server Error. An error occurred on the server.
 */

/**
 * @swagger
 * /orders/checkout:
 *   post:
 *     summary: Checkout a shopping cart
 *     tags:
 *       - Order
 *     parameters:
 *       - in: query
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the user who owns the cart to be checked out.
 *       - in: query
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shopping cart to be checked out.
 *     responses:
 *       '200':
 *         description: Checkout successful
 *       '404':
 *         description: User or cart not found
 *       '500':
 *         description: Internal server error
 */



/**
 * @swagger
 * /orders:
 *   get:
 *     summary: Get all orders with product details
 *     description: Retrieve a list of all orders along with their associated product details.
 *     tags:
 *       - Order
 *     responses:
 *       '200':
 *         description: List of all orders with product details retrieved successfully.
 *       '404':
 *         description: No orders found.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /orders/{id}:
 *   get:
 *     summary: Get a shopping order by ID
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shopping order to retrieve.
 *     responses:
 *       '200':
 *         description: Shopping order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/orders'
 *       '404':
 *         description: Shopping cart not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /orders/TotalRevenue:
 *   get:
 *     summary: Get total revenue
 *     description: Retrive total revenue in the interval between.
 *     tags:
 *       - Order
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Start date for the range (YYYY-MM-DD).
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: End date for the range (YYYY-MM-DD).
 *     responses:
 *       '200':
 *         description: Data within the date range.
 *       '400':
 *         description: Invalid input data.
 */

/**
 * @swagger
 * /orders/getTopTenSellingProduct:
 *   get:
 *     summary: Get the top 10 most sold products
 *     description: Retrieve the top 10 most sold products based on order history.
 *     tags:
 *       - Order
 *     responses:
 *       '200':
 *         description: List of the top 10 most sold products retrieved successfully.
 *       '404':
 *         description: No products found or no sales data available.
 *       '500':
 *         description: Internal server error.
 */

/**
 * @swagger
 * /orders/totalProductSales:
 *   get:
 *     summary: Get the total number of product sales within a date range
 *     description: Retrieve the total number of product sales within a specified date range.
 *     tags:
 *       - Order
 *     parameters:
 *       - in: query
 *         name: startDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The start date of the date range for sales data (e.g., 'YYYY-MM-DD').
 *       - in: query
 *         name: endDate
 *         required: true
 *         schema:
 *           type: string
 *           format: date
 *         description: The end date of the date range for sales data (e.g., 'YYYY-MM-DD').
 *     responses:
 *       '200':
 *         description: Total number of product sales within the specified date range retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 total_sales:
 *                   type: integer
 *                   description: The total number of product sales within the specified date range.
 *       '404':
 *         description: No sales data available within the specified date range.
 *       '500':
 *         description: Internal server error.
 */

router.route("/totalProductSales").get(getTotalProductSales)
router.route("/getTopTenSellingProduct").get(topSoldProducts)
router.route("/removeFromCart").delete(removeFromCart)
router.route("/addtocart").post(addToCart);
router.route("/checkout").post(checkout)
router.route("/totalRevenue").get(totalRevenue)
router.route("/").get(getAllOrders)
router.route("/:id").get(viewOrderOfUser)
 module.exports = router;
