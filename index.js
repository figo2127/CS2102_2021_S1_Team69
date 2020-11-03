const express = require("express");
const app = express();
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5000;
// const cors = require("cors");

const pool = require("./db");
//Import Routes
const authRoute = require('./routes/auth');
const ownerRoute = require('./routes/owner');
const adminRoute = require('./routes/admin');
const carerRoute = require('./routes/carer');
const summaryRoute = require('./routes/summary');
const categoryRoute = require('./routes/category');
const petRoute = require('./routes/pet');

//middleware
// app.use(cors());
app.use(express.json()); //req.body

//Route Middlewares
app.use('/auth', authRoute);
app.use('/owners', ownerRoute);
app.use('/admins', adminRoute);
app.use('/carers', carerRoute);
app.use('/summary', summaryRoute);
app.use('/categories', categoryRoute);
app.use('/pets', petRoute);



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










app.listen(PORT, () => {
  console.log(`server has started on port ${PORT}`);
});