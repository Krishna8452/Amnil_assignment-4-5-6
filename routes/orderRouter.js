const express = require("express");
const router = express.Router();

const {
  getAllOrders,
  addToCart,
  removeFromCart
} = require("../modules/cart/cartController");


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
 * /orders/:
 *   get:
 *     summary: Get a list of all shopping orders
 *     tags:
 *       - Order
 *     responses:
 *       '200':
 *         description: List of shopping orders retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/orders'
 *       '500':
 *         description: Internal server error
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

router.route("/removeFromCart").delete(removeFromCart)
router.route("/addtocart").post(addToCart);
 module.exports = router;
