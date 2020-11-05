const router = require('express').Router();
const { authUser, authAdmin } = require('./verifyToken');
const pool = require("../db");

/**
 * input of format
 * {
 *  "particularYear" : "2020",
 *  "particularMonth": "10",
 * }
 * output a single integer
 * get the number of pet days of a carer in a particular month
 * checked correct
 */
router.get("/total-petday-of-particular-month/:year/:month", async (req, res) => {
  try {
    var {year, month} = req.params;
    var startOfMonthDate = new Date(year, month - 1, "01");
    var startOfNextMonthDate = new Date(year, month, "01");
    const result = await pool.query(`
      SELECT * FROM bids
      where is_successful = TRUE
      AND (EXTRACT(year from start_date) = $1 OR EXTRACT(year from end_date) = $1) 
      AND (EXTRACT(month from start_date) = $2 OR EXTRACT(month from end_date) = $2)`,
      [year, month]
    );
    var sum = 0;
    var tuples = result.rows;
    for (var i = 0; i < tuples.length; i++) {
      var rowObj = tuples[i];
      var start = rowObj.start_date;
      var end = rowObj.end_date;
      var actualStart = startOfMonthDate > start ? startOfMonthDate : start;
      var actualEnd = startOfNextMonthDate < end ? startOfNextMonthDate : end;
      var days = Math.round((actualEnd - actualStart)/(1000 * 60 * 60 * 24)) + 1;
      sum += days;
    }
    var jsonObj = new Object();
    jsonObj["sum"] = sum;
    var jsonString = JSON.stringify(jsonObj);
    res.json(jsonString);
  } catch (err) {
    console.log("Error in getting total petday of particular month");
    console.error(err);
  }
})

//3. rank owner money spend in certain month (based on bid date)
//e.g. summary/owner-spend-rank/10/2020
router.get("/owner-spend-rank/:month/:year", authUser, authAdmin, async (req, res) => {
    try {
      const { month, year } = req.params;
      const owners = await pool.query(`
        SELECT owner_name, SUM((end_date - start_date)*daily_price) AS money_spend
        FROM bids WHERE is_successful = True 
        AND EXTRACT(MONTH FROM bid_date) = $1
        AND EXTRACT(YEAR FROM bid_date) = $2
        GROUP BY owner_name
        ORDER BY money_spend DESC`, [
          month, year
      ]);
      res.json(owners.rows);
    } catch (err) {
      console.error(err.message);
    }
  });


//total number of pets taken care of in xx month by xx carer (assuming month is an integer [1, 12])
// /summary/num-pets/10/2020/gycc
router.get("/num-pets/:month/:year/:carer_name", authUser, async (req, res) => {
  try {
    const { month, year, carer_name } = req.params;
    const getNumPets = await pool.query(
        `SELECT COUNT(*) 
        FROM bids 
        WHERE carer_name = $1
        AND EXTRACT(MONTH FROM start_date) = $2
        AND EXTRACT(YEAR FROM start_date) = $3;`,
      [carer_name, month, year]
    );
    res.json(getNumPets.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
})

//total number of pets taken care of in xx month (assuming month is an integer [1, 12])
// /summary/num-pets/10/2020/gycc
router.get("/num-pets/:year/:month", async (req, res) => {
  try {
    const { month, year } = req.params;
    // const monthInt = parseInt(month);
    // const yearInt = parseInt(year);
    const getNumPets = await pool.query(
        `SELECT COUNT(*) 
        FROM bids 
        WHERE EXTRACT(MONTH FROM start_date) = $1
        AND EXTRACT(YEAR FROM start_date) = $2;`,
      [month, year]
    );
    res.json(getNumPets.rows[0]);
  } catch (err) {
    console.log(err.message);
  }
})

//  get monthly salary by carer name for xx month (assuming month is an integer [1, 12])
// summary/salary/10/2020/gycc
router.get("/salary/:month/:year/:carer_name", async (req, res) => {
  try {
    const { year, month, carer_name } = req.params;
    const start_of_month = `${year}-${month}-01`
    let base_pay = 0.0
    let portion = 0.75;
    let offset = 0;
    const isFulltime =  await pool.query(
        `SELECT is_fulltime FROM carers WHERE carer_name = $1`, [carer_name]);
    if (!isFulltime.rows[0]) return res.status(400).send('Incorrect carer name');
    if (isFulltime.rows[0]) {
      base_pay = 3000.0
      portion = 0.80;
      offset = 60;
    }
    let query =
      `SELECT (SUM (b.daily_price) OVER ()) * $1 + $2 AS salary
      FROM (
          SELECT generate_series(
            $3,
            (DATE($3) + INTERVAL '1 month' - INTERVAL '1 day')::DATE,
            '1 day'::interval
          )::date AS day
      ) days_in_month
      CROSS JOIN bids b
      WHERE
        b.start_date <= day AND b.end_date >= day AND
        b.carer_name = $4
      ORDER BY
        day ASC,
        daily_price ASC
      OFFSET $5;`;
    const getSalary = await pool.query(query, [portion, base_pay, start_of_month, carer_name, offset]);
    if (getSalary.rows[0]) {
      res.json(getSalary.rows[0]);
    } else {
      res.json({ salary: "3000.00" });
    }
  } catch (err) {
    console.log(err.message);
  }
})

//  get total monthly salary for xx month (assuming month is an integer [1, 12])
// summary/salary/10/2020/gycc
router.get("/totalsalary/:month/:year/:carer_name", async (req, res) => {
  try {
    const { year, month, carer_name } = req.params;
    const start_of_month = `${year}-${month}-01`
    let base_pay = 0.0
    let portion = 0.75;
    let offset = 0;
    const isFulltime =  await pool.query(
        `SELECT is_fulltime FROM carers WHERE carer_name = $1`, [carer_name]);
    if (!isFulltime.rows[0]) return res.status(400).send('Incorrect carer name');
    if (isFulltime.rows[0]) {
      base_pay = 3000.0
      portion = 0.80;
      offset = 60;
    }
    let query =
      `SELECT (SUM (b.daily_price) OVER ()) * $1 + $2 AS salary
      FROM (
          SELECT generate_series(
            $3,
            (DATE($3) + INTERVAL '1 month' - INTERVAL '1 day')::DATE,
            '1 day'::interval
          )::date AS day
      ) days_in_month
      CROSS JOIN bids b
      WHERE
        b.start_date <= day AND b.end_date >= day AND
        b.carer_name = $4
      ORDER BY
        day ASC,
        daily_price ASC
      OFFSET $5;`;
    const getSalary = await pool.query(query, [portion, base_pay, start_of_month, carer_name, offset]);
    if (getSalary.rows[0]) {
      res.json(getSalary.rows[0]);
    } else {
      res.json({ salary: "3000.00" });
    }
  } catch (err) {
    console.log(err.message);
  }
})
module.exports = router;