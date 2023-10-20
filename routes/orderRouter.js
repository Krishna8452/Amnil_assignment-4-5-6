const express = require("express");
const router = express.Router();

const {
  getOrders,
  getOrderById,
  checkout,
  deleteOrderById,
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
 *           description: The ID of the user who placed the order.
 *         cartId:
 *           type: string
 *           description: The ID of the shopping cart associated with the order.
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
 *                 description: The quantity of the product in the order.
 *         price:
 *           type: number
 *           description: The total price of the order.
 *           default: 0
 *       example:
 *         userId: "5f8a2b9a3deac124c82294e0"
 *         cartId: "5f8a2b9a3deac124c82294e1"
 *         items:
 *           - productId: "5f8a2b9a3deac124c82294e2"
 *             quantity: 3
 *         price: 150.99
 */

/**
 * @swagger
 * tags:
 *   - name: Order
 *     description: Order-related APIs
 */

/**
 * @swagger
 * /orders/checkout/{cartId}:
 *   post:
 *     summary: Checkout a shopping cart
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: cartId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shopping cart to checkout.
 *     responses:
 *       '200':
 *         description: Shopping cart checked out successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/orders'
 *       '400':
 *         description: Minimum cart price not met
 *       '404':
 *         description: Cart not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /orders/:
 *   get:
 *     summary: Get a list of all orders
 *     tags:
 *       - Order
 *     responses:
 *       '200':
 *         description: List of orders retrieved successfully
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
 *     summary: Get an order by ID
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to retrieve.
 *     responses:
 *       '200':
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/orders'
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /orders/delete/{id}:
 *   delete:
 *     summary: Delete an order by ID
 *     tags:
 *       - Order
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the order to delete.
 *     responses:
 *       '200':
 *         description: Order deleted successfully
 *       '404':
 *         description: Order not found
 *       '500':
 *         description: Internal server error
 */


router.route("/checkout/:cartId").post(checkout);
router.route("/").get(getOrders);
router.route("/:id").get(getOrderById);
router.route("/delete/:id").delete(deleteOrderById);

module.exports = router;
