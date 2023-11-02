const express = require("express");
const router = express.Router();

const {
  addToCart,
  getAllCart,
  getCartById,
  deleteCart
} = require("../modules/cart/cartController");


/**
 * @swagger
 * components:
 *   schemas:
 *     carts:
 *       type: object
 *       properties:
 *         userId:
 *           type: string
 *           description: The ID of the user who owns the cart.
 *         items:
 *           type: array
 *           description: An array of items in the cart.
 *           items:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 description: The ID of the product in the cart.
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
 *   - name: Cart
 *     description: Cart-related APIs
 */

/**
 * @swagger
 * /carts/add:
 *   post:
 *     summary: Add items to a shopping cart
 *     tags:
 *       - Cart
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/carts'
 *     responses:
 *       '200':
 *         description: Items added to the cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/carts'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /carts/:
 *   get:
 *     summary: Get a list of all shopping carts
 *     tags:
 *       - Cart
 *     responses:
 *       '200':
 *         description: List of shopping carts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/carts'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /carts/{id}:
 *   get:
 *     summary: Get a shopping cart by ID
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shopping cart to retrieve.
 *     responses:
 *       '200':
 *         description: Shopping cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/carts'
 *       '404':
 *         description: Shopping cart not found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /carts/delete/{id}:
 *   delete:
 *     summary: Delete a shopping cart by ID
 *     tags:
 *       - Cart
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the shopping cart to delete.
 *     responses:
 *       '200':
 *         description: Shopping cart deleted successfully
 *       '404':
 *         description: Shopping cart not found
 *       '500':
 *         description: Internal server error
 */



router.route("/add").post(addToCart);
router.route("/").get(getAllCart);
router.route("/:id").get(getCartById);
router.route("/delete/:id").delete(deleteCart);
 module.exports = router;
