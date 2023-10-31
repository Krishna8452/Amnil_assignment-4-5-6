const express = require("express");
const router = express.Router();

const {
  addStore,
  newLogo,
  getAllStores,
  getSingleStore,
  deleteStore,
  updateStore,
  getNearestStore
} = require("../modules/store/storeController");

/**
 * @swagger
 * components:
 *   schemas:
 *     Store:
 *       type: object
 *       properties:
 *         store_name:
 *           type: string
 *         product_type:
 *           type: string
 *           enum: ['Grocery', 'Electronics', 'Stationary', 'Clothing']
 *         userId:
 *           type: string
 *         location:
 *           type: object
 *           properties:
 *             type:
 *               type: string
 *               default: Point
 *             coordinates:
 *               type: array
 *               items:
 *                 type: number
 *       example:
 *         store_name: "Example Store"
 *         product_type: "Grocery"
 *         userId: "user_id"
 *         location:
 *           type: "Point"
 *           coordinates: [longitude, latitude]
 */

/**
 * @swagger
 * tags:
 *   - name: Store
 *     description: Stores all APIs
 */

/**
 * @swagger
 * /store/nearestStore:
 *   get:
 *     summary: Get nearest stores within a 10KM radius
 *     tags:
 *       - Store
 *     parameters:
 *       - name: longitude
 *         in: query
 *         schema:
 *           type: number
 *         required: true
 *         description: Longitude coordinate for the search location
 *       - name: latitude
 *         in: query
 *         schema:
 *           type: number
 *         required: true
 *         description: Latitude coordinate for the search location
 *       - name: store_name
 *         in: query
 *         schema:
 *           type: string
 *         description: Search for stores by name (case-insensitive)
 *     responses:
 *       '200':
 *         description: Nearby stores within a 10KM radius
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 *       '404':
 *         description: No stores found
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /store/add:
 *   post:
 *     summary: Add a new store
 *     tags:
 *       - Store
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: User ID associated with the store
 *               store_name:
 *                 type: string
 *                 description: Name of the store
 *               product_type:
 *                 type: string
 *                 enum: ['Grocery', 'Electronics', 'Stationary', 'Clothing']
 *                 description: Type of products in the store
 *               logo:
 *                 type: string
 *                 format: binary
 *                 description: Store logo image
 *               longitude:
 *                 type: number
 *                 description: Longitude coordinate for the store location
 *               latitude:
 *                 type: number
 *                 description: Latitude coordinate for the store location
 *     responses:
 *       '201':
 *         description: Store added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       '400':
 *         description: Bad request
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /store:
 *   get:
 *     summary: Get all stores
 *     tags:
 *       - Store
 *     responses:
 *       '200':
 *         description: All lists of stores
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Store'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /store/{id}:
 *   get:
 *     summary: Get a single store by ID
 *     tags:
 *       - Store
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Store information
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       '404':
 *         description: Store not found
 *       '500':
 *         description: Internal server error
 * /store/edit/{id}:
 *   put:
 *     summary: Update a store by ID
 *     tags:
 *       - Store
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
 *             $ref: '#/components/schemas/Store'
 *     responses:
 *       '200':
 *         description: Store updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Store'
 *       '404':
 *         description: Store not found
 *       '500':
 *         description: Internal server error
 * /store/delete/{id}:
 *   delete:
 *     summary: Delete a store by ID
 *     tags:
 *       - Store
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Store deleted successfully
 *       '404':
 *         description: Store not found
 *       '500':
 *         description: Internal server error
 */

router.route("/nearestStore").get(getNearestStore)
router.route("/add").post(newLogo, addStore);
router.route("/delete/:id").delete(deleteStore);
router.route("/").get(getAllStores);
router.route("/:id").get(getSingleStore);
router.route("/edit/:id").put(updateStore)

module.exports = router;
    