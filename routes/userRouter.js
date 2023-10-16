const express = require("express");
const router = express.Router();
const firebaseAuthentication = require('../middleware/firebaseAuthentication')

const { getAllUsers, getUser, addUser, editUser, deleteUser,userLogin, registerUser}  = require("../modules/user/userController");

 router.route('/').get(firebaseAuthentication,getAllUsers)
 router.route('/login').post(userLogin)
 router.route('/:id').get(getUser)
 router.route('/add').post(addUser)
 router.route('/edit/:id').put(editUser)
 router.route('/delete/:id').delete(deleteUser)
 router.route('/auth/register').post(registerUser)

 module.exports = router;