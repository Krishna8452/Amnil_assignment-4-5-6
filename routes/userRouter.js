const express = require("express");
const router = express.Router();

const { getAllUsers, getUser, addUser, editUser, deleteUser }  = require("../modules/user/userController");

 router.route('/').get(getAllUsers)
 router.route('/:id').get(getUser)
 router.route('/add').post(addUser)
 router.route('/edit/:id').put(editUser)
 router.route('/delete/:id').delete(deleteUser)

 module.exports = router;