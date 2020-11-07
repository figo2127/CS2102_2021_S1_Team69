const router = require('express').Router();
const pool = require("../db");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');


//create an admin account

// Need request body in format
// {
// "username" : "superadmin",
// "password" : "superadmin",
// "name" : "beining",
// "phone" : "87654321"
// }
// Note: area and address columns is optional
// return inserted data upon success

router.post("/register/admin", async (req, res) => {
    
    const { error } = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    //Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);
    const client = await pool.connect();
    try {
        const { username, name, phone, area, address} = req.body;
        await client.query('BEGIN');
        await client.query(
            `INSERT INTO accounts (username, password_hash, name, phone, area, address) VALUES($1, $2, $3, $4, $5, $6)`,
            [username, hashPassword, name, phone, area, address]
        );
        await client.query(
            `INSERT INTO admins VALUES($1)`,
            [username]
        );
        await client.query('COMMIT');
        res.send(`Admin account with username ${username} has been created!`)
    } catch (err) {
        await client.query('ROLLBACK');
        return res.status(400).send(err.message);
    } finally {
        client.release();
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
    const client = await pool.connect();
    try {
        const { username, name, phone, area, address} = req.body;
        await client.query('BEGIN');
        await client.query(
            `INSERT INTO accounts (username, password_hash, name, phone, area, address) VALUES($1, $2, $3, $4, $5, $6)`,
            [username, hashPassword, name, phone, area, address]
        );
        await client.query(
            `INSERT INTO owners VALUES($1)`,
            [username]
        );
        await client.query('COMMIT');
        res.send(`Owner account with username ${username} has been created!`)
    } catch (err) {
        await client.query('ROLLBACK');
        return res.status(400).send(err.message);
    } finally {
        client.release();
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
    const client = await pool.connect();
    try {
        const { username, name, phone, area, address, isFulltime} = req.body;
        await client.query('BEGIN');
        await client.query(
            `INSERT INTO accounts (username, password_hash, name, phone, area, address) VALUES($1, $2, $3, $4, $5, $6)`,
            [username, hashPassword, name, phone, area, address]
        );
        await client.query(
            `INSERT INTO carers VALUES($1, null, $2)`,
            [username, isFulltime === 'true']
        );
        await client.query('COMMIT');
        res.send(`Carer account with username ${username} has been created!`);
    } catch (err) {
        await client.query('ROLLBACK');
        return res.status(400).send(err.message);
    } finally {
        client.release();
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
    if (result.rows.length == 0) return res.status(400).send('Username does not exist');
    //Checkong password is correct
    const user = result.rows[0];
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(400).send('Incorrect password');
    
    //Create and assign a token
    const token = jwt.sign({ username: user.username }, process.env.TOKEN_SECRET);
    const getUserType = await pool.query(`
    SELECT
        exists (select * from admins where admin_name = $1) as isAdmin,
        exists (select * from carers where carer_name = $1) as isCarer,
        exists (select * from owners where owner_name = $1) as isOwner
    `, [username]);
    const userType = ["admin", "carer", "owner"].filter((type) => getUserType.rows[0][`is${type}`]);
    res.status(200).header('auth-token', token).json({ userType, token, username });
});

router.get('/authenticate/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const result = jwt.verify(token, process.env.TOKEN_SECRET);
        res.json(result);
    } catch (err) {
        res.status(401).send('Token is invalid');
    }
});

router.get('/add-account-type/:username/:accType', async (req, res) => {
    try {
        const { username, accType } = req.params;
        if (accType === 'owner') {
            await pool.query(
                `Insert INTO owners VALUES ($1);`
                , [username]
            );
        } else if (accType.includes('carer')) {
            const isFulltime = accType.includes('full-time');
            await pool.query(
                `Insert INTO carers VALUES ($1, null, $2);`,
                [username, isFulltime]
            );
        } else {
            res.status(400).send('Invalid account type');
            return;
        }
        const getUserType = await pool.query(`
            SELECT
                exists (select * from admins where admin_name = $1) as isAdmin,
                exists (select * from carers where carer_name = $1) as isCarer,
                exists (select * from owners where owner_name = $1) as isOwner
            `, [username]
        );
        const userType = ["admin", "carer", "owner"].filter((type) => getUserType.rows[0][`is${type}`]);
        res.json({ userType });
    } catch (err) {
        res.status(400).send(err.message);
    }
});




module.exports = router;