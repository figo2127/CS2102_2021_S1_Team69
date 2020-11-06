const router = require('express').Router();
const { authUser } = require('./verifyToken');
const pool = require("../db");

// create bid
router.post("/", async (req, res) => {
  try {
    const {start_date, end_date, carer_name, owner_name, pname, bid_date, daily_price, is_successful, credit_card_num, payment_date, payment_mode, delivery_method, review_rating, review_content, review_date} = req.body;
    const createBid = await pool.query(`
      INSERT INTO bids VALUES
      (
        $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15
      );
    `,[
      start_date, end_date, carer_name, owner_name, pname, bid_date, daily_price, is_successful, credit_card_num, payment_date, payment_mode, delivery_method, review_rating, review_content, review_date
    ]);
    res.status(200).json(createBid.rows);
  } catch(err) {
    console.log(err.message);
  }
})

// get all bids by owner name
router.get("/owner/:owner_name", async (req, res) => {
    try {
      const { owner_name } = req.params;
      const getBids = await pool.query(`SELECT * FROM bids WHERE owner_name = $1;`, [owner_name]);
      res.status(200).json(getBids.rows);
    } catch (err) {
      console.log(err.message);
    }
})

// get all successful bids by owner name
router.get("/success/owner/:owner_name", async (req, res) => {
    try {
      const { owner_name } = req.params;
      const getBids = await pool.query(`SELECT * FROM bids WHERE owner_name = $1 AND is_successful = true;`, [owner_name]);
      res.status(200).json(getBids.rows);
    } catch (err) {
      console.log(err.message);
    }
})

// get all bids by carer name
router.get("/carer/:carer_name", async (req, res) => {
    try {
      const { carer_name } = req.params;
      const getBids = await pool.query(`SELECT * FROM bids WHERE carer_name = $1;`, [carer_name]);
      res.status(200).json(getBids.rows);
    } catch (err) {
      console.log(err.message);
    }
})

// get all successful bids by owner name
router.get("/success/carer/:carer_name", async (req, res) => {
    try {
      const { carer_name } = req.params;
      const getBids = await pool.query(`SELECT * FROM bids WHERE carer_name = $1 AND is_successful = true;`, [carer_name]);
      res.status(200).json(getBids.rows);
    } catch (err) {
      console.log(err.message);
    }
})

module.exports = router;
