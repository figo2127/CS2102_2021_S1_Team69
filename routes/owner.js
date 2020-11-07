const router = require('express').Router();
const bcrypt = require('bcryptjs');
const pool = require("../db");
const { authUser } = require('./verifyToken');

//getOwnerInfo by owner name
router.get('/:owner_name', async (req, res) => {
    const { owner_name } = req.params;
    try {
        const result = await pool.query(
          `SELECT owner_name, name,  phone, area, address FROM owners o, accounts a
          WHERE o.owner_name = a.username
          AND o.owner_name = $1;`, [owner_name]
          );
          res.status(200).json(result.rows[0]);
    } catch (err) {
        res.status(400).send(err.message);
    }
});


//update Owner Info
/**
 * Unchecked due to no owner table created yet
 */
router.put("/:owner_name", async (req, res) => {
    try {
      const { owner_name } = req.params;
      const { phone, area, address } = req.body;

      const updateOwnerInfo = await pool.query(
        "UPDATE accounts SET phone = $1, area = $2, address = $3 WHERE username = $4",
        [ phone, area, address, owner_name]
      );
      res.send("Owner info updated successfully")
    } catch (err) {
      console.error(err.message);
    }
  })

//6. get all review given by a owner sort by date beining
router.get("/reviews/:owner_name", authUser, async (req, res) => {
  try {
    const { owner_name } = req.params;
    const reviews = await pool.query(`
    SELECT review_rating, review_content, review_date 
    FROM bids WHERE owner_name = $1 
    AND review_rating IS NOT NULL
    ORDER BY review_date DESC`, [
        owner_name
    ]);
    res.json(reviews.rows);
  } catch (err) {
    console.error(err.message);
  }
});

router.get("/bids/:owner_name", async (req, res) => {
  try {
    const { owner_name } = req.params;
    const getBids = await pool.query(`SELECT * FROM bids WHERE owner_name = $1;`, [owner_name]);
    res.json(getBids.rows);
  } catch (err) {
    console.log(err.message);
  }
})

module.exports = router;