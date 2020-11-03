const router = require('express').Router();
const { authUser, authAdmin } = require('./verifyToken');
const pool = require("../db");

router.get("/accounts", authUser, authAdmin, async (req, res) => {
  try {
    const allAccounts = await pool.query(
      "SELECT * FROM accounts"
    );
    res.json(allAccounts.rows);
  } catch (err) {
    console.log(err.message);
  }
})

router.get("/admins", authUser, authAdmin, async (req, res) => {
    try {
      const allAdmins = await pool.query("SELECT * FROM admin");
      res.json(allAdmins.rows);
    } catch (err) {
      console.error(err.message);
    }
})

module.exports = router;
