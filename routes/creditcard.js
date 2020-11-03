const router = require('express').Router();
const { authUser } = require('./verifyToken');
const pool = require("../db");

// create/add creditcard
// tested
router.post("/", async (req, res) => {
  try {
    const {
      owner_name,
      credit_card_num,
      expiry_date,
      cvv
    } = req.body;
    const result = await pool.query(
      "INSERT INTO credit_cards (owner_name, credit_card_num, expiry_date, cvv) VALUES($1, $2, $3, $4);",
      [owner_name, credit_card_num, expiry_date, cvv]
    );
    res.send("Credit Card added successfully!");
  } catch (err) {
    console.error(err.message);
  }
})

// retrieve creditcard info
// tested
router.get("/:owner_name", authUser, async (req, res) => {
  try {
    const { owner_name } = req.params;
    const result = await pool.query(
      "SELECT * FROM credit_cards WHERE owner_name = $1;",
      [owner_name]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
})

// update creditcard info
// tested
router.put("/:credit_card_num", authUser, async (req, res) => {
  try {
    const { username, credit_card_num, expiry_date, cvv } = req.body;
    const result = await pool.query(
      "UPDATE credit_cards SET expiry_date = $1, cvv = $2 WHERE owner_name = $3 AND credit_card_num = $4;",
      [expiry_date, cvv, username, credit_card_num]
    );
    res.send("Credit Card info updated!");
  } catch (err) {
    console.error(err.message);
  }
})

// delete creditcard
// tested
router.delete("/", authUser, async (req, res) => {
  try {
    const { owner_name, credit_card_num } = req.body;
    const result = await pool.query(
      "DELETE FROM credit_cards WHERE owner_name = $1 AND credit_card_num = $2;",
      [owner_name, credit_card_num]
    );
    res.send("Credit Card removed successfully!");
  } catch (err) {
    console.error(err.message);
  }
})

module.exports = router;