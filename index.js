const express = require("express");
const app = express();

const PORT = process.env.PORT || 5000;
// const cors = require("cors");
const pool = require("./db");
//Import Routes
const authRoute = require('./routes/auth');

//middleware
// app.use(cors());
app.use(express.json()); //req.body

//Route Middlewares
app.use('/user', authRoute);






// //ROUTES//
// app.get("/accounts", async (req, res) => {
//   try {
//     const allAccounts = await pool.query(
//       "SELECT * FROM accounts"
//     );
//     res.json(allAccounts.rows);
//   } catch (err) {
//     console.log(err.message);
//   }
// })


// //create Account
// /**
//  * Need request body in format
//  * {
//  *  "username" : "activeuser",
//  *  "password" : "123456",
//  *  "name" : "yichao",
//  *  "phone" : "86561895",
//  *  "area" : "South",
//  *  "address" : "12 Kent Ridge Drive"
//  * }
//  * Note: area and address columns is optional
//  * return inserted data upon success
//  */
// app.post("/accounts", async (req, res) => {
//   try {
//     // const allAccounts = await pool.query("SELECT * FROM accounts");
//     // res.json(allAccounts.rows);
//     const { username, password, name, phone, area, address} = req.body;
//     const newAccount = await pool.query(
//       "INSERT INTO accounts (username, password, name, phone, area, address) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
//       [username, password, name, phone, area, address]
//     );
//     res.json(newAccount.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// //login
// /**
//  * Need request body in format
//  * {
//  *  "username" : "activeuser",
//  *  "password" : "123456"
//  * }
//  * if success return corresponding database row
//  * else return string "Incorrect username or password"
//  */
// app.get("/accounts/login", async (req, res) => {
//   try {
//     const { username, password } = req.body;
//     const result = await pool.query(
//       "SELECT * FROM accounts WHERE username = $1 and password = $2",
//       [username, password]
//     );
//     if (result.rows.length == 0) {
//       res.send("Incorrect username or password");
//     } else {
//       res.json(result.rows[0]);
//     }
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// /**
//  * input format
//  * {
//  *  "carer_name" : "zz"
//  * }
//  * output a single integer
//  * get the number of pet days of a carer in current month
//  * checked correct
//  */
// app.get("/carers/getpetdayofcurrentmonth", async (req, res) => {
//   try {
//     var today = new Date();
//     var currentYear = today.getFullYear();
//     var currentMonth = today.getMonth() + 1;
//     var startOfMonthDate = new Date(currentYear, currentMonth - 1, "01");
//     var startOfNextMonthDate = new Date(currentYear, currentMonth, "01");
//     const {carer_name} = req.body;
//     const result = await pool.query(`
//       SELECT * FROM bids 
//       WHERE carer_name = $1
//       AND is_successful = TRUE
//       AND (EXTRACT(year from start_date) = $2 OR EXTRACT(year from end_date) = $2) 
//       AND (EXTRACT(month from start_date) = $3 OR EXTRACT(month from end_date) = $3)`,
//       [carer_name, currentYear, currentMonth]
//     );
//     var sum = 0;
//     var tuples = result.rows;
//     for (var i = 0; i < tuples.length; i++) {
//       var rowObj = tuples[i];
//       var start = rowObj.start_date;
//       var end = rowObj.end_date;
//       var actualStart = startOfMonthDate > start ? startOfMonthDate : start;
//       var actualEnd = startOfNextMonthDate < end ? startOfNextMonthDate : end;
//       var days = Math.round((actualEnd - actualStart)/(1000 * 60 * 60 * 24)) + 1;
//       sum += days;
//     }
//     res.send("" + sum);
//   } catch (err) {
//     console.log("Error in getting carer's petday of current month");
//     console.error(err);
//   }
// })

// /**
//  * input of format
//  * {
//  *  "particularYear" : "2020",
//  *  "particularMonth": "10",
//  *  "carer_name"     : "zz"
//  * }
//  * output a single integer
//  * get the number of pet days of a carer in a particular month
//  * checked correct
//  */
// app.get("/carers/getpetdayofparticularmonth", async (req, res) => {
//   try {
//     var {particularYear, particularMonth, carer_name} = req.body;
//     var startOfMonthDate = new Date(particularYear, particularMonth - 1, "01");
//     var startOfNextMonthDate = new Date(particularYear, particularMonth, "01");
//     const result = await pool.query(`
//       SELECT * FROM bids 
//       WHERE carer_name = $1
//       AND is_successful = TRUE
//       AND (EXTRACT(year from start_date) = $2 OR EXTRACT(year from end_date) = $2) 
//       AND (EXTRACT(month from start_date) = $3 OR EXTRACT(month from end_date) = $3)`,
//       [carer_name, particularYear, particularMonth]
//     );
//     var sum = 0;
//     var tuples = result.rows;
//     for (var i = 0; i < tuples.length; i++) {
//       var rowObj = tuples[i];
//       var start = rowObj.start_date;
//       var end = rowObj.end_date;
//       var actualStart = startOfMonthDate > start ? startOfMonthDate : start;
//       var actualEnd = startOfNextMonthDate < end ? startOfNextMonthDate : end;
//       var days = Math.round((actualEnd - actualStart)/(1000 * 60 * 60 * 24)) + 1;
//       sum += days;
//     }
//     res.send("" + sum);
//   } catch (err) {
//     console.log("Error in getting carer's petday of particular month");
//     console.error(err);
//   }
// })

// /**
//  * input of format
//  * {
//  *  "particularYear" : "2020",
//  *  "particularMonth": "10",
//  * }
//  * output a single integer
//  * get the number of pet days of a carer in a particular month
//  * checked correct
//  */
// app.get("/summary/gettotalpetdayofparticularmonth", async (req, res) => {
//   try {
//     var {particularYear, particularMonth} = req.body;
//     var startOfMonthDate = new Date(particularYear, particularMonth - 1, "01");
//     var startOfNextMonthDate = new Date(particularYear, particularMonth, "01");
//     const result = await pool.query(`
//       SELECT * FROM bids
//       where is_successful = TRUE
//       AND (EXTRACT(year from start_date) = $1 OR EXTRACT(year from end_date) = $1) 
//       AND (EXTRACT(month from start_date) = $2 OR EXTRACT(month from end_date) = $2)`,
//       [particularYear, particularMonth]
//     );
//     var sum = 0;
//     var tuples = result.rows;
//     for (var i = 0; i < tuples.length; i++) {
//       var rowObj = tuples[i];
//       var start = rowObj.start_date;
//       var end = rowObj.end_date;
//       var actualStart = startOfMonthDate > start ? startOfMonthDate : start;
//       var actualEnd = startOfNextMonthDate < end ? startOfNextMonthDate : end;
//       var days = Math.round((actualEnd - actualStart)/(1000 * 60 * 60 * 24)) + 1;
//       sum += days;
//     }
//     res.send("" + sum);
//   } catch (err) {
//     console.log("Error in getting total petday of particular month");
//     console.error(err);
//   }
// })

// //getOwnerInfo
// /**
//  * need request body in format
//  * {
//  *  "username" : "activeuser"
//  * }
//  * return combined json result from accounts table and owners table
//  * Unchecked due to no owner table created yet
//  */
// app.get("/owners/:username", async (req, res) => {
//   try {
//     const { username } = req.body;
//     const result = await pool.query(
//       "SELECT * FROM owners WHERE username = $1",
//       [username]
//     );
//     const result2 = await pool.query(
//       "SELECT * FROM accounts WHERE username = $1",
//       [username]
//     );
//     const combinedResult = result.rows[0].concat(result2.rows[0]);
//     res.json(combinedResult);
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// //update Owner Info
// /**
//  * Unchecked due to no owner table created yet
//  */
// app.put("/owners/:username", async (req, res) => {
//   try {
//     const { username } = req.params;
//     const { password, name, phone, area, address } = req.body;
//     const updateOwnerInfo = await pool.query(
//       "UPDATE accounts SET password = $2, name = $3, phone = $4, area = $5, address = $6 WHERE username = $7",
//       [password, name, phone, area, address, username]
//     );
//     res.send("Owner info updated successfully")
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// app.get("/admins", async (req, res) => {
//   try {
//     const allAdmins = await pool.query("SELECT * FROM admin");
//     res.json(allAdmins.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// // app.post("/accounts", async (req, res) => {
// //   try{
// //     const { desc } = req.body;
// //     console.log(desc);
// //     res.json(req);
// //   } catch (err) {
// //     console.error(err.message);
// //   }
// // })

// //add a new category
// app.post("/categories", async (req, res) => {
//   try{
//     const { category_name, base_price } = req.body;
//     const newCategory = await pool.query(
//       "INSERT INTO categories (category_name, base_price) VALUES($1, $2) RETURNING *",
//       [category_name, base_price]
//     );
//     res.json(newCategory.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// })


// //get all categories
// app.get("/categories", async (req, res) => {
//   try {
//     const allCategories = await pool.query("SELECT * FROM categories;");
//     res.json(allCategories.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //get a category by category_name
// app.get("/categories/:category_name", async (req, res) => {
//   try {
//     const { category_name } = req.params;
//     const category = await pool.query("SELECT * FROM categories WHERE category_name = $1", [category_name]);
//     res.json(category.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //update a category
// app.put("/categories/:category_name", async (req, res) => {
//   try {
//     const { category_name  } = req.params;
//     const { base_price } = req.body;
//     const updateCategory = await pool.query(
//       "UPDATE category SET base_price = $1 WHERE category_name = $2",
//       [base_price, category_name]
//     );
//     res.json("Category was updated!");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //delete a category
// app.delete("/categories/:category_name", async (req, res) => {
//   try {
//     const { category_name } = req.params;
//     const deleteCategory = await pool.query("DELETE FROM category WHERE category_name = $1", [
//       category_name
//     ]);
//     res.json("Category was deleted!");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

// // create/add creditcard
// app.post("/creditcard", async (req, res) => {
//   try {
//     const {
//       username,
//       credit_card_num,
//       expiry_date,
//       cvv
//     } = req.body;
//     const result = await pool.query(
//       "INSERT INTO credit_card (owner_username, credit_card_num, expiry_date, cvv) VALUES($1, $2, $3, $4);",
//       [username, credit_card_num, expiry_date, cvv]
//     );
//     res.send("Credit Card added successfully!");
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// // retrieve creditcard info
// app.get("/creditcard/:owner_name", async (req, res) => {
//   try {
//     const { owner_name } = req.params;
//     const result = await pool.query(
//       "SELECT * FROM credit_card WHERE owner_username = $1;",
//       [owner_name]
//     );
//     res.json(result.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// // update creditcard info
// app.put("/creditcard/:credit_card_num", async (req, res) => {
//   try {
//     const { username, credit_card_num, expiry_date, cvv } = req.body;
//     const result = await pool.query(
//       "UPDATE credit_card SET expiry_date = $1, cvv = $2 WHERE owner_username = $3 AND credit_card_num = $4;",
//       [expiry_date, cvv, username, credit_card_num]
//     );
//     res.send("Credit Card info updated!");
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// // delete creditcard
// app.delete("/creditcard/delete", async (req, res) => {
//   try {
//     const { username, credit_card_num } = req.body;
//     const result = await pool.query(
//       "DELETE FROM credit_card WHERE owner_username = $1 AND credit_card_num = $2;",
//       [username, credit_card_num]
//     );
//     res.send("Credit Card removed successfully!");
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// // get list of carers
// app.get("/carers/get-list-of-carer", async (req, res) => {
//   try {
//     const allCarers = await pool.query(
//       "SELECT * FROM carers"
//     );
//     res.json(allCarers.rows);
//   } catch (err) {
//     console.log(err.message);
//   }
// })

// app.get("/carers/get-carer-by", async (req, res) => {
//   try {
//     const { rating, category } = req.body;
//     const result = await pool.query(
//       "SELECT * FROM carers WHERE rating = $1 AND category = $2",
//       [rating, category]
//     );
//     if (result.rows.length == 0) {
//       res.send("No such carer");
//     } else {
//       res.json(result.rows[0]);
//     }
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// //get all reviews for a carer sort by review_rating
// app.get("/carers/reviews-by-rating/:carer_name", async (req, res) => {
//   try {
//     const { carer_name } = req.body;
//     const result = await pool.query(
//       "SELECT review_rating, review_content, review_date FROM bids WHERE carer_name = $1 AND review_rating NOT NULL ORDER BY review_rating DESC",
//       [carer_name]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// //get all reviews for a carer sorted by date
// app.get("/carers/reviews-by-date/:carer_name", async (req, res) => {
//   try {
//     const { carer_name } = req.params;
//     const result = await pool.query(
//       "SELECT review_rating, review_content FROM bids WHERE carer_name = $1 AND review_date NOT NULL ORDER BY review_date DESC",
//       [carer_name]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// //create a bid
// app.post("/bids", async(req, res) => {
//   try {
//     const{ carer_name, owner_name, start_date, end_date, payment_mode, payment_date, credit_card_num, delivery_method, price, bid_date } = req.body;
//     const newPet = await pool.query(
//       "INSERT INTO bids (carer_name, owner_name, start_date, end_date, payment_mode, payment_date, credit_card_num, delivery_method, price, bid_date, is_successful, review_date, review_content, review_rating) VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, NULL, NULL, NULL, NULL) RETURNING *",
//       [carer_name, owner_name, start_date, end_date, payment_mode, payment_date, credit_card_num, delivery_method, price, bid_date]
//     );
//     res.json(newPet.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //get bids
// app.get("/bids/carers/:carer_name", async (req, res) => {
//   try {
//     const { carer_name } = req.params;
//     const result = await pool.query(
//       "SELECT carer_name, owner_name, start_date, end_date, payment_mode, payment_date, credit_card_num, delivery_method, price, bid_date, is_successful, review_date, review_content, review_rating FROM bids WHERE carer_name = $1 ORDER BY bid_date DESC",
//       [carer_name]
//     );
//     res.json(result.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// })

// // create a pet
// app.post("/pets", async (req, res) => {
//   try {
//     const { pname, ownername, requirements, belongs } = req.body;
//     const newPet = await pool.query(
//       "INSERT INTO pets (pname, ownername, requirements, belongs) VALUES($1, $2, $3, $4) RETURNING *",
//       [pname, ownername, requirements, belongs]
//     );
//     res.json(newPet.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// // get all pets
// app.get("/pets", async (req, res) => {
//   try {
//     const allPets = await pool.query("SELECT * FROM pets");
//     res.json(allPets.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// // get a pet
// app.get("/pets/:pname", async (req, res) => {
//   try {
//     const { pname } = req.params;
//     const pet = await pool.query("SELECT * FROM pets WHERE pname = $1", [
//       pname
//     ]);
//     res.json(pet.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// // update a pet
// app.put("/pets/:pname", async (req, res) => {
//   try {
//     const { pname, ownername, requirements, belongs } = req.params;
//     const updatePet = await pool.query(
//       "UPDATE pets SET ownername = $1, requirements = $2, belongs = $3 WHERE pname = $4",
//       [ownername, requirements, belongs, pname]
//     );
//     res.json("Pet was updated!");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// // delete a pet
// app.delete("/pets/:pname", async (req, res) => {
//   try {
//     const { pname } = req.params;
//     const deletePet = await pool.query("DELETE FROM pets WHERE pname = $1", [
//       pname
//     ]);
//     res.json("Pet was deleted!");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

// // 1. filter carer by pet category jiaying
// app.get("/carers/:category", async (req, res) => {
//   try {
//     const { category_name } = req.params;
//     const carer = await pool.query(`
//     SELECT carer_name
//     FROM takes_care
//     WHERE category_name = $1;`, [
//   category_name
//     ]);
//     res.json(carer.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });


// // 2. get list of carer, show their ($x) category price (sort) jiaying
// app.get("/carers/price/:category", async (req, res) => {
//   try {
//     const { category_name } = req.params;
//     const carer = await pool.query(`
//     SELECT carers.username, base_price,
//     CASE WHEN base_price > 4 THEN base_price * 1.2
//       WHEN base_price > 3 THEN base_price * 1.1
//       ELSE base_price
//       END AS price
//     FROM carers, categories
//     WHERE carers.category = $1
//     ORDER BY categories.base_price;
//     `, [
//   category_name
//     ]);
//     res.json(carer.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //3. rank owner money spend per month beining
// app.get("/owners/spend/:month/:year", async (req, res) => {
//   try {
//     const { month, year } = req.params;
//     const owners = await pool.query(`
//       SELECT owner_name, SUM((end_date - start_date)*daily_price) AS money_spend
//       FROM bids WHERE is_sucessful = True 
//       AND EXTRACT(MONTH FROM bid_date) = $1
//       AND EXTRACT(YEAR FROM bid_date) = $2
//       GROUP BY owner_name
//       ORDER BY money_spend DESC`, [
//         month, year
//     ]);
//     res.json(owners.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// //6. get all review given by a owner sort by date beining
// app.get("/reviews/owners/:owner_name", async (req, res) => {
//   try {
//     const { owner_name } = req.params;
//     const reviews = await pool.query(`
//     SELECT review_rating, review_content, review_date 
//     FROM bids WHERE owner_name = $1 
//     AND review_rating IS NOT NULL
//     ORDER BY review_date DESC`, [
//         owner_name
//     ]);
//     res.json(reviews.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

// // 9. total number of pets taken care of in ($x) month (assuming month is an integer [1, 12])
// app.post("/num-pets", async (req, res) => {
//   try {
//     const { month, carer_name } = req.body;
//     const getNumPets = await pool.query(
//       "SELECT COUNT(*) FROM bids WHERE EXTRACT(MONTH FROM start_date) = $1 AND carer_name = $2;",
//       [month, carer_name]
//     );
//     res.json(getNumPets.rows[0]);
//   } catch (err) {
//     console.log(err.message);
//   }
// })

// // 10. get monthly salary by carer name for ($x) month (assuming month is an integer [1, 12])
// app.post("/salary", async (req, res) => {
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

// // 11. get list of sucess bids by owner name 
// app.post("/bids/owners/:owner_name", async (req, res) => {
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


app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});