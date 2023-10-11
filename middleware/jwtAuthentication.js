const users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.jwtAuthentication = async (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) {
    return res.status(401).json({ error:"Unauthorized: token Missing"});
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);   
    const { username } = decoded;

    const userFromDatabase = await users.findOne(username);

    if (!userFromDatabase) {
      return res.status(401).json({ message: "Unauthorized: User does not exist" });
     }
    req.user = userFromDatabase;
    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};
