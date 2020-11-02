const router = require('express').Router();
const { authUser } = require('./verifyToken');
const { authAdmin } = require('../permissions/admin');
const { canViewOwnerInfo } = require('../permissions/owner');
const pool = require("../db");

//getOwnerInfo by owner name
router.get('/:owner_name', authUser, canViewOwnerInfo, async (req, res) => {
    const { owner_name } = req.params;
    try {
        const result = await pool.query(
            "SELECT * FROM owners WHERE owner_name = $1",
            [owner_name]
          );
        const result2 = await pool.query(
            "SELECT * FROM accounts WHERE username = $1",
            [owner_name]
          );
        const combinedResult = result.rows[0].concat(result2.rows[0]);
        res.status(200).json(combinedResult);
    } catch (err) {
        res.status(400).send(err.message);
    }

});

module.exports = router;