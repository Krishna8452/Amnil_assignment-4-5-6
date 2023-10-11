require("dotenv").config();
const users = require('../../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const {admin} = require("../../firebase/admin")

exports.getAllUsers = async(req, res) => {
  const data = await users.find({});
  res.json(data);
}

exports.getUser = async (req, res) =>{
  const userId =req.params.id; 
  const data = await users.findById(userId)
  if (!data) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(data);
}

exports.addUser = async (req, res) =>{
  const {name, username, password, address, phone } = req.body
  const bcryptedPassword = await bcrypt.hash(password, 10);
  const newUser ={
    name:name,
    username:username,
    address:address,
    phone:phone,
    password:bcryptedPassword
  }
    await users.create(newUser)
    res.status(201).json({success: 'user created successfully'});
}

exports.editUser = async (req, res) =>{
  try {
    const userId = req.params.id;
    const updates = req.body;
    const updatedUser = await users.findByIdAndUpdate(userId, updates, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({updatedUser, success: 'user updated successfuly!'});
  }catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.deleteUser = async (req, res) =>{
  try {
    const userId = req.params.id;
    const deletedUser = await users.findByIdAndRemove(userId);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
}

exports.userLogin = async (req,res)=>{
  try {
   const {username, password} = req.body;
   const user = await users.findOne({username})
   const passwordMatch = await bcrypt.compare(password, user.password )
   if(!passwordMatch){
    return res.send("Invalid login details");
  }
  const payload = {
      user:
      { 
        name: user.username,
        password:user.password
      }
    }
   const token = jwt.sign(payload, process.env.JWT_SECRET,{expiresIn:'1h'})
   res.send({token: token})
  }catch(error) {
    return res.status(400).send("Invalid details")
  }
 }

 exports.googleSignUp = async (req, res) => {
  try{
    const user = {
    email:req.body.email,
    password:req.body.password
  }
  const userResponse = await admin.auth().createUser({
    email:user.email,
    password:user.password,
    emailVerified:false,
    disabled:false
  })
  res.json({message:'user created',userResponse})
}catch(error){
  res.status(500).send('server error')
}
}

exports.googleSignIn = async (req, res) =>{
  const email = req.body.email;
  const password = req.body.password;

  try {
    const user = await admin.auth().getUserByEmail(email);

    if (user && user.password === password) {
      const customToken = await admin.auth().createCustomToken(user.uid);
      res.json({ customToken });
    } else {
      res.status(401).send('Invalid email or password');
    }
  } catch (error) {
    res.status(500).send('Sign-in error: ' + error.message);
  }
}
