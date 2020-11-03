const jwt = require('jsonwebtoken');
const pool = require("../db");

function authUser(req, res, next) {
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Acess Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
}

async function isAdmin  (username) {
    const result = await pool.query(
      "SELECT * FROM admins WHERE admin_name = $1",
      [username]
    );
    return result.rows.length != 0;
}

async function authAdmin(req, res, next) {
    try {
        if(! await isAdmin(req.user.username)) return res.status(401).send('Acess Denied');
        next();
    } catch(err) {
        res.status(400).send('Invalid Token');
    }
}

module.exports = {
    authUser,
    authAdmin
}