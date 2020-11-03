const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require("../db");
const { authUser } = require('./verifyToken');
const { canViewOwnerInfo, canUpdateOwnerInfo } = require('../permissions/owner');


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


//update Owner Info
/**
 * Unchecked due to no owner table created yet
 */
router.put("/owners/:owner_name", authUser, canUpdateOwnerInfo, async (req, res) => {
    try {
      const { owner_name } = req.params;
      const { password, name, phone, area, address } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const updateOwnerInfo = await pool.query(
        "UPDATE accounts SET password = $2, name = $3, phone = $4, area = $5, address = $6 WHERE username = $7",
        [hashPassword, name, phone, area, address, owner_name]
      );
      res.send("Owner info updated successfully")
    } catch (err) {
      console.error(err.message);
    }
  })

module.exports = router;