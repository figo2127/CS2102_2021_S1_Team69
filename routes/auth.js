const router = require('express').Router();
const pool = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');


//create an admin account
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
router.post("/register/admin", async (req, res) => {
    
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
        newAccount = await pool.query(
            "INSERT INTO admins VALUES($1) RETURNING *",
            [username]
        );
        res.json({ admin_name: newAccount.rows[0].username});
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

//create an owner account
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
router.post("/register/owner", async (req, res) => {
    
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
        newAccount = await pool.query(
            "INSERT INTO owners VALUES($1) RETURNING *",
            [username]
        );
        res.json({ owner_name: newAccount.rows[0].username});
    } catch (err) {
        return res.status(400).send(err.message);
    }
});

//create an carer account
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
router.post("/register/carer", async (req, res) => {
    
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
        newAccount = await pool.query(
            "INSERT INTO carers VALUES($1) RETURNING *",
            [username]
        );
        res.json({ carer_name: newAccount.rows[0].username});
    } catch (err) {
        return res.status(400).send(err.message);
    }
});


//login
/**
 * Need request body in format
 * {
 *  "username" : "activeuser",
 *  "password" : "123456"
 * }
 */
router.post('/login', async (req, res) => {
    const { error } = loginValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
    const { username, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM accounts WHERE username = $1",
      [username]
    );
    //Checking if username exists
    if (result.rows.length == 0) return res.status(400).send('username does not exist');
    //Checkong password is correct
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).send('Incorrect password');
    
    //Create and assign a token
    const token = jwt.sign({ username: user.username }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);

     //res.send('Logged In');
});




module.exports = router;