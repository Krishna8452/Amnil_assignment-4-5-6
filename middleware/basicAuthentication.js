const pool = require('../db/db');
const bcrypt = require('bcrypt');


exports.basicAuthentication = async (req, res, next) => {
  const credentials = req.header('Authorization');
  if (!credentials) {
    return res.status(400).json({ error: 'Please provide a token' });
  }
  const decoded = Buffer.from(credentials, 'base64').toString('utf-8');
  const [username, password] = decoded.split(':');

  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const { rows } = await pool.query(query, [username]);

    if (rows.length === 0) {
      return res.status(401).json({ message: 'Unauthorized: Username does not exist' });
    }

    const userFromDatabase = rows[0];
    const doesPasswordMatch = await bcrypt.compare(password, userFromDatabase.password);

    if (doesPasswordMatch) {
      req.user = userFromDatabase;
      next();
    } else {
      return res.status(401).json({ error: 'Unauthorized: Invalid username and password' });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
