const router = require('express').Router();
const { authUser } = require('./verifyToken');
const pool = require("../db");

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
      SELECT takes_care.carer_name, takes_care.carer_price
      FROM takes_care, categories
      WHERE takes_care.category_name = categories.category_name
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

/**
 * input format
 * {
 *  "carer_name" : "zz"
 * }
 * output a single integer
 * get the number of pet days of a carer in current month
 * checked correct
 */
router.get("/petdayofcurrentmonth", authUser, async (req, res) => {
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

/**
 * input of format
 * {
 *  "particularYear" : "2020",
 *  "particularMonth": "10",
 *  "carer_name"     : "zz"
 * }
 * output a single integer
 * get the number of pet days of a carer in a particular month
 * checked correct
 */
router.get("/petdayofparticularmonth", authUser, async (req, res) => {
  try {
    var {particularYear, particularMonth, carer_name} = req.body;
    var startOfMonthDate = new Date(particularYear, particularMonth - 1, "01");
    var startOfNextMonthDate = new Date(particularYear, particularMonth, "01");
    const result = await pool.query(`
      SELECT * FROM bids 
      WHERE carer_name = $1
      AND is_successful = TRUE
      AND (EXTRACT(year from start_date) = $2 OR EXTRACT(year from end_date) = $2) 
      AND (EXTRACT(month from start_date) = $3 OR EXTRACT(month from end_date) = $3)`,
      [carer_name, particularYear, particularMonth]
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