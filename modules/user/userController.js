const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { admin } = require("../../firebase/admin");
const pool = require('../../db/db')


pool.connect()
.then(()=>{
  console.log('postgreSQL database connected successfully')
})
.catch((error) =>{
  console.log(error, "failed to connect with postgreSQL database")
})

exports.getAllUsers = async (req, res) => {
  try {
    const query = "SELECT * FROM users"; 
    const { rows } = await pool.query(query);
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUser = async (req, res) => {
  const userId = req.params.id;
  try {
    const query = "SELECT * FROM users WHERE id = $1"; 
    const { rows } = await pool.query(query, [userId]);
    if (rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.addUser = async (req, res) => {
  try {
    const {id, name, username, password, address, phone, email } = req.body;
    const userExistQuery = "SELECT * FROM users WHERE username = $1"; 
    const { rows: existingUsers } = await pool.query(userExistQuery, [username]);

    if (existingUsers.length > 0) {
      return res.json("Username already exists");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertUserQuery =
      "INSERT INTO users (id, name, username, hashedPassword, address, phone, email) VALUES ($1, $2, $3, $4, $5, $6, $7)"; 
    await pool.query(insertUserQuery, [id, name, username, hashedPassword, address, phone, email]);

    res.status(201).json({ success: "User created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.editUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updates = req.body;
    const updateQuery = "UPDATE users SET name = $1, username = $2, password = $3, address = $4, phone = $5, email = $6 WHERE id = $7"; // Replace 'users' with your PostgreSQL table name
    const { rows } = await pool.query(updateQuery, [
      updates.name,
      updates.username,
      updates.password,
      updates.address,
      updates.phone,
      updates.email,
      userId,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ success: "User updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const deleteQuery = "DELETE FROM users WHERE id = $1"; 
    const { rowCount } = await pool.query(deleteQuery, [userId]);

    if (rowCount === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.userLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const userQuery = "SELECT * FROM users WHERE username = $1"; 
    const { rows: userRows } = await pool.query(userQuery, [username]);

    if (userRows.length === 0) {
      return res.send("Invalid login details");
    }

    const user = userRows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.send("Invalid login details");
    }

    const payload = {
      user: {
        name: user.username,
        password: user.password,
      },
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.send({ message: "User logged in successfully!!!", token: token });
  } catch (error) {
    console.error(error);
    return res.status(400).send("Invalid details");
  }
};

exports.registerUser = async (req, res) => {
  const token = req.body.token;
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;

    const userRecord = await admin.auth().getUser(uid);
    const userQuery = "SELECT * FROM users WHERE email = $1";
    const { rows: userRows } = await pool.query(userQuery, [userRecord.email]);

    if (userRows.length === 0) {
      const createUserQuery = "INSERT INTO users (name, email) VALUES ($1, $2)"; 
      await pool.query(createUserQuery, [userRecord.displayName, userRecord.email]);
    }

    res.json(userRecord);
  } catch (error) {
    console.error("Error verifying token or fetching user data:", error);
    res.status(400).json({ error: "Token verification failed" });
  }
};
