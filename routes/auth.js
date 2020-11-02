const router = require('express').Router();
const pool = require("../db");
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');
//create Account
/**
 * Need request body in format
 * {
 *  "username" : "activeuser",
 *  "password" : "123456",
 *  "name" : "yichao",
 *  "phone" : "86561895",
 *  "area" : "South",
 *  "address" : "12 Kent Ridge Drive"
 * }
 * Note: area and address columns is optional
 * return inserted data upon success
 */
router.post("/register", async (req, res) => {
    
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    try {
        const { username, name, phone, area, address} = req.body;
        const newAccount = await pool.query(
        "INSERT INTO accounts (username, password_hash, name, phone, area, address) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
        [username, hashPassword, name, phone, area, address]
        );
        res.json({ username: newAccount.rows[0].username});
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { username, password } = req.body;
    const user = await pool.query(
      "SELECT * FROM accounts WHERE username = $1",
      [username]
    );
    //Checking if username exists
    if (user.rows.length == 0) return res.status(400).send('username does not exist');
    //Checkong password is correct
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) return res.status(400).send('Incorrect password');
    res.send('Logged In');
});

//login
/**
 * Need request body in format
 * {
 *  "username" : "activeuser",
 *  "password" : "123456"
 * }
 * if success return corresponding database row
 * else return string "Incorrect username or password"
 */
router.get("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM accounts WHERE username = $1 and password = $2",
      [username, password]
    );
    if (result.rows.length == 0) {
      res.send("Incorrect username or password");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
      res.status(400).send(err);
  }
})


module.exports = router;