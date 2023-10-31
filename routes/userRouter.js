const express = require("express");
const router = express.Router();
const firebaseAuthentication = require("../middleware/firebaseAuthentication");

const {
  getAllUsers,
  getUser,
  addUser,
  editUser,
  deleteUser,
  userLogin,
  registerUser,
} = require("../modules/user/userController");


/**
 * @swagger
 * components:
 *   schemas:
 *     users:
 *       type: object
 *       required:
 *         - name
 *         - username
 *         - password 
 *         - email
 *         - phone
 *       properties:
 *         id:
 *           type: string
 *           description: Auto-generated user ID
 *         name:
 *           type: string
 *           description: User's name
 *         username:
 *           type: string
 *           description: User's username
 *         password:
 *           type: string
 *           description: User's password
 *         email:
 *           type: string
 *           description: User's email
 *         phone:
 *           type: string
 *           description: User's phone number
 *       example:
 *         id: dfghjkhjk
 *         name: krishna
 *         username: krishna10
 *         password: krishna84
 *         email: krishna@gmail.com
 *         phone: 9847053191
 */

/**
 * @swagger
 * tags:
 *   - name: User
 *     description: Users all APIs
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     tags:
 *       - User
 *     responses:
 *       '200':
 *         description: User list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       '500':
 *         description: Internal server error
 * /users/add:
 *   post:
 *     summary: Add a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/users'
 *     responses:
 *       '200':
 *         description: User added successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/users'
 *     responses:
 *       '200':
 *         description: User logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       '500':
 *         description: Internal server error
 * /users/edit/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags:
 *       - User
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
 *             $ref: '#/components/schemas/users'
 *     responses:
 *       '200':
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       '500':
 *         description: Internal server error

 * /users/delete/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags:
 *       - User
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: User deleted successfully
 *       '500':
 *         description: Internal server error
 */

/**
 * @swagger
 * /users/auth/register:
 *   post:
 *     summary: Register a new user
 *     tags:
 *       - User
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/users'
 *     responses:
 *       '200':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/users'
 *       '500':
 *         description: Internal server error
 */


router.route("/").get( getAllUsers);
router.route("/login").post(userLogin);
router.route("/:id").get(getUser);
router.route("/add").post(addUser);
router.route("/edit/:id").put(editUser);
router.route("/delete/:id").delete(firebaseAuthentication, deleteUser);
router.route("/auth/register").post(registerUser);

module.exports = router;
