const router = require('express').Router();
const { authUser } = require('./verifyToken');
const pool = require("../db");

// get list of carers info
// tested
router.get("/", async (req, res) => {
  try {
    const allCarers = await pool.query(
      `SELECT carer_name, rating, is_fulltime, name,  phone, area FROM carers c, accounts a
      WHERE c.carer_name = a.username;
      `
    );
    res.status(200).json(allCarers.rows);
  } catch (err) {
    console.log(err.message);
  }
})

// get detail info of a carer by carer_name
router.get("/:carer_name", async (req, res) => {
  const { carer_name } = req.params;
  try {
      const result = await pool.query(
        `SELECT carer_name, rating, is_fulltime, name,  phone, area FROM carers c, accounts a
        WHERE c.carer_name = a.username
        AND c.carer_name = $1;
        `, [carer_name]
        );

      res.status(200).json(result.rows[0]);
  } catch (err) {
      res.status(400).send(err.message);
  }
})

// 1. filter carer by pet category jiaying
router.get("/:category_name", async (req, res) => {
    try {
      const { category_name } = req.params;
      const carer = await pool.query(`
      SELECT carer_name
      FROM takes_care
      WHERE category_name = $1;`, [
        category_name
      ]);
      res.json(carer.rows);
    } catch (err) {
      console.error(err.message);
    }
  });


// 2. get list of carer, show their ($x) category price (sort) jiaying
router.get("/price/:category_name", async (req, res) => {
    try {
      const { category_name } = req.params;
      const carer = await pool.query(`
      SELECT carers.carer_name, 
      CASE WHEN carers.rating > 4 THEN categories.base_price * 1.2
         WHEN carers.rating > 3 THEN categories.base_price * 1.1
         ELSE categories.base_price
         END AS price
      FROM takes_care, categories, carers
      WHERE takes_care.category_name = categories.category_name AND carers.carer_name = takes_care.carer_name
      AND takes_care.category_name = $1
      ORDER BY takes_care.carer_price;
      `, [
        category_name
      ]);
      res.json(carer.rows);
    } catch (err) {
      console.error(err.message);
    }
  });



//get all reviews for a carer sort by review_rating
//tested
router.get("/reviews-by-rating/:carer_name", async (req, res) => {
  try {
    const { carer_name } = req.params;
    const result = await pool.query(
      "SELECT review_rating, review_content, review_date FROM bids WHERE carer_name = $1 AND review_rating IS NOT NULL ORDER BY review_rating DESC",
      [carer_name]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
})

//tested
router.get("/get-carer-by-rating-category", async (req, res) => {
  try {
    const { rating, category } = req.body;
    const result = await pool.query(
      "SELECT * FROM carers WHERE rating = $1 AND carer_name IN (SELECT carer_name FROM takes_care WHERE category_name = $2)",
      [rating, category]
    );
    if (result.rows.length == 0) {
      res.send("No such carer");
    } else {
      res.json(result.rows);
    }
  } catch (err) {
    console.error(err.message);
  }
})

//get all reviews for a carer sorted by date
//tested
router.get("/reviews-by-date/:carer_name", async (req, res) => {
  try {
    const { carer_name } = req.params;
    const result = await pool.query(
      "SELECT review_rating, review_content FROM bids WHERE carer_name = $1 AND review_date IS NOT NULL ORDER BY review_date DESC",
      [carer_name]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
})

/**
 * input format
 * {
 *  "carer_name" : "zz"
 * }
 * output a single integer
 * get the number of pet days of a carer in current month
 * checked correct
 */
//tested
router.get("/petday-of-currentmonth", authUser, async (req, res) => {
  try {
    var today = new Date();
    var currentYear = today.getFullYear();
    var currentMonth = today.getMonth() + 1;
    var startOfMonthDate = new Date(currentYear, currentMonth - 1, "01");
    var startOfNextMonthDate = new Date(currentYear, currentMonth, "01");
    const {carer_name} = req.body;
    const result = await pool.query(`
      SELECT * FROM bids 
      WHERE carer_name = $1
      AND is_successful = TRUE
      AND (EXTRACT(year from start_date) = $2 OR EXTRACT(year from end_date) = $2) 
      AND (EXTRACT(month from start_date) = $3 OR EXTRACT(month from end_date) = $3)`,
      [carer_name, currentYear, currentMonth]
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
    res.send("" + sum);
  } catch (err) {
    console.log("Error in getting carer's petday of current month");
    console.error(err);
  }
})

//
// input of format
// {
//  "particular_year" : "2020",
//  "particular_month": "10",
//  "carer_name"     : "zz"
// }
// output a single integer
// get the number of pet days of a carer in a particular month
// checked correct
//
//tested
router.get("/petday-of-particular-month", authUser, async (req, res) => {
  try {
    var {particular_year, particular_month, carer_name} = req.body;
    var startOfMonthDate = new Date(particular_year, particular_month - 1, "01");
    var startOfNextMonthDate = new Date(particular_year, particular_month, "01");
    const result = await pool.query(`
      SELECT * FROM bids 
      WHERE carer_name = $1
      AND is_successful = TRUE
      AND (EXTRACT(year from start_date) = $2 OR EXTRACT(year from end_date) = $2) 
      AND (EXTRACT(month from start_date) = $3 OR EXTRACT(month from end_date) = $3)`,
      [carer_name, particular_year, particular_month]
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
    res.send("" + sum);
  } catch (err) {
    console.log("Error in getting carer's petday of particular month");
    console.error(err);
  }
})

module.exports = router;
