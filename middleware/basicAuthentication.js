const users = require("../models/userModel");
const bcrypt = require("bcrypt");

exports.basicAuthentication = async (req, res, next) => {
    const credentials = req.header("Authorization");
    if (!credentials) {
        return res.status(400).json({ error: "please provide token" });
    }
    const decoded = Buffer.from(credentials, "base64").toString("utf-8");
    const [username, password] = decoded.split(":");
    try {
        const userFromDatabase = await users.findOne({ username });
        if (!userFromDatabase) {
            return res.status(401).json({ message: "Unauthorized: username doesnot exist" });
        }
        const doesPasswordMatch = await bcrypt.compare(password, userFromDatabase.password);
        if (doesPasswordMatch) {
            req.user = userFromDatabase;
            next();
        } else {
            return res.status(401).json({ error: "Unauthorized: Invalid username and password..." });
        }
    }catch(error){
        return res.status(500).json({ error: "Internal Server Error" });
    }
};
