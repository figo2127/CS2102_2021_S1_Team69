const router = require('express').Router();
const { authUser } = require('./verifyToken');
const { authAdmin } = require('../permissions/admin');
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
router.get("/gettotalpetdayofparticularmonth", authUser, authAdmin, async (req, res) => {
  try {
    var {particularYear, particularMonth} = req.body;
    var startOfMonthDate = new Date(particularYear, particularMonth - 1, "01");
    var startOfNextMonthDate = new Date(particularYear, particularMonth, "01");
    const result = await pool.query(`
      SELECT * FROM bids
      where is_successful = TRUE
      AND (EXTRACT(year from start_date) = $1 OR EXTRACT(year from end_date) = $1) 
      AND (EXTRACT(month from start_date) = $2 OR EXTRACT(month from end_date) = $2)`,
      [particularYear, particularMonth]
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
    console.log("Error in getting total petday of particular month");
    console.error(err);
  }
})

module.exports = router;