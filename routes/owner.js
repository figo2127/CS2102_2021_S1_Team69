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


// get list of sucess bids by owner name 
// router.post("/bids/:owner_name", async (req, res) => {
//   try {
//     const { year, month, carer_name, is_fulltime } = req.body;
//     const start_of_month = `${year}-${month}-01`
//     let base_pay = 0.0
//     let portion = 0.75;
//     let offset = 0;
//     if (is_fulltime) {
//       base_pay = 3000.0
//       portion = 0.80;
//       offset = 60;
//     }
//     let query =
//       `SELECT (SUM (b.daily_price) OVER ()) * $1 + $2 AS salary
//       FROM (
//           SELECT generate_series(
//             $3,
//             (DATE($3) + INTERVAL '1 month' - INTERVAL '1 day')::DATE,
//             '1 day'::interval
//           )::date AS day
//       ) days_in_month
//       CROSS JOIN bids b
//       WHERE
//         b.start_date <= day AND b.end_date >= day AND
//         b.carer_name = $4
//       ORDER BY
//         day ASC,
//         daily_price ASC
//       OFFSET $5;`;
//     const getSalary = await pool.query(query, [portion, base_pay, start_of_month, carer_name, offset]);
//     if (getSalary.rows[0]) {
//       res.json(getSalary.rows[0]);
//     } else {
//       res.json({ salary: "3000.00" });
//     }
//   } catch (err) {
//     console.log(err.message);
//   }
// })


module.exports = router;