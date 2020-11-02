const pool = require("../db");

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
    isAdmin,
    authAdmin
}