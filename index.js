const express = require("express");
const app = express();
// const cors = require("cors");
const pool = require("./db");

//middleware
// app.use(cors());
app.use(express.json()); //req.body

//ROUTES//
app.get("/accounts", async (req, res) => {
  try {
    const allAccounts = await pool.query(
      "SELECT * FROM accounts"
    );
    res.json(allAccounts.rows);
  } catch (err) {
    console.log(err.message);
  }
})


//create Account
/**
 * Need request body in format
 * {
 *  "username" : "activeuser",
 *  "password" : "123456",
 *  "name" : "yichao",
 *  "phone" : "86561895",
 *  "area" : "South",
 *  "address" : "12 Kent Ridge Drive"
 * }
 * Note: area and address columns is optional
 * return inserted data upon success
 */
app.post("/accounts", async (req, res) => {
  try {
    // const allAccounts = await pool.query("SELECT * FROM accounts");
    // res.json(allAccounts.rows);
    const { username, password, name, phone, area, address} = req.body;
    const newAccount = await pool.query(
      "INSERT INTO accounts (username, password, name, phone, area, address) VALUES($1, $2, $3, $4, $5, $6) RETURNING *",
      [username, password, name, phone, area, address]
    );
    res.json(newAccount.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})

//login
/**
 * Need request body in format
 * {
 *  "username" : "activeuser",
 *  "password" : "123456"
 * }
 * if success return corresponding database row
 * else return string "Incorrect username or password"
 */
app.get("/accounts/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    const result = await pool.query(
      "SELECT * FROM accounts WHERE username = $1 and password = $2",
      [username, password]
    );
    if (result.rows.length == 0) {
      res.send("Incorrect username or password");
      // res.json({content: "Incorrect username or password"})
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
})

//getOwnerInfo
/**
 * need request body in format
 * {
 *  "username" : "activeuser"
 * }
 * return combined json result from accounts table and owners table
 * Unchecked due to no owner table created yet
 */
app.get("/owners/getOwnerInfo", async (req, res) => {
  try {
    const { username } = req.body;
    const result = await pool.query(
      "SELECT * FROM owners WHERE username = $1",
      [username]
    );
    const result2 = await pool.query(
      "SELECT * FROM accounts WHERE username = $1",
      [username]
    );
    const combinedResult = result.rows[0].concat(result2.rows[0]);
    res.json(combinedResult);
  } catch (err) {
    console.error(err.message);
  }
})

//update Owner Info
/**
 * Unchecked due to no owner table created yet
 */
app.put("/owners/updateOwnerInfo", async (req, res) => {
  try {
    const { username } = req.params;
    const { password, name, phone, area, address } = req.body;
    const updateOwnerInfo = await pool.query(
      "UPDATE accounts SET password = $2, name = $3, phone = $4, area = $5, address = $6 WHERE username = $7",
      [password, name, phone, area, address, username]
    );
    res.send("Owner info updated successfully")
  } catch (err) {
    console.error(err.message);
  }
})

app.get("/admins", async (req, res) => {
  try {
    const allAdmins = await pool.query("SELECT * FROM admin");
    res.json(allAdmins.rows);
  } catch (err) {
    console.error(err.message);
  }
})

// app.post("/accounts", async (req, res) => {
//   try{
//     const { desc } = req.body;
//     console.log(desc);
//     res.json(req);
//   } catch (err) {
//     console.error(err.message);
//   }
// })

//add a new category
app.post("/categories", async (req, res) => {
  try{
    const { category_name, base_price } = req.body;
    const newCategory = await pool.query(
      "INSERT INTO categories (category_name, base_price) VALUES($1, $2) RETURNING *",
      [category_name, base_price]
    );
    res.json(newCategory.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})


//get all categories
app.get("/categories", async (req, res) => {
  try {
    const allCategories = await pool.query("SELECT * FROM categories;");
    res.json(allCategories.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a category by category_name
app.get("/categories/:category_name", async (req, res) => {
  try {
    const { category_name } = req.params;
    const category = await pool.query("SELECT * FROM categories WHERE category_name = $1", [category_name]);
    res.json(category.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a category
app.put("/categories/:category_name", async (req, res) => {
  try {
    const { category_name  } = req.params;
    const { base_price } = req.body;
    const updateCategory = await pool.query(
      "UPDATE category SET base_price = $1 WHERE category_name = $2",
      [base_price, category_name]
    );
    res.json("Category was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a category
app.delete("/categories/:category_name", async (req, res) => {
  try {
    const { category_name } = req.params;
    const deleteCategory = await pool.query("DELETE FROM category WHERE category_name = $1", [
      category_name
    ]);
    res.json("Category was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

// create/add creditcard
app.post("/creditcard/create", async (req, res) => {
  try {
    const {
      username,
      credit_card_num,
      expiry_date,
      cvv
    } = req.body;
    const result = await pool.query(
      "INSERT INTO credit_card (owner_username, credit_card_num, expiry_date, cvv) VALUES($1, $2, $3, $4);",
      [username, credit_card_num, expiry_date, cvv]
    );
    res.send("Credit Card added successfully!");
  } catch (err) {
    console.error(err.message);
  }
})

// retrieve creditcard info
app.post("/creditcard/read", async (req, res) => {
  try {
    const {
      username,
      credit_card_num
    } = req.body;
    const result = await pool.query(
      "SELECT * FROM credit_card WHERE owner_username = $1 AND credit_card_num = $2;",
      [username, credit_card_num]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
})

// update creditcard info
app.put("/creditcard/update", async (req, res) => {
  try {
    const {
      username,
      credit_card_num,
      expiry_date,
      cvv
    } = req.body;
    const result = await pool.query(
      "UPDATE credit_card SET expiry_date = $1, cvv = $2 WHERE owner_username = $3 AND credit_card_num = $4;",
      [expiry_date, cvv, username, credit_card_num]
    );
    res.send("Credit Card info updated!");
  } catch (err) {
    console.error(err.message);
  }
})

// delete creditcard
app.delete("/creditcard/delete", async (req, res) => {
  try {
    const {
      username,
      credit_card_num
    } = req.body;
    const result = await pool.query(
      "DELETE FROM credit_card WHERE owner_username = $1 AND credit_card_num = $2;",
      [username, credit_card_num]
    );
    res.send("Credit Card removed successfully!");
  } catch (err) {
    console.error(err.message);
  }
})

// get list of carers
app.get("/carers/getListOfCarer", async (req, res) => {
  try {
    const allCarers = await pool.query(
      "SELECT * FROM carers"
    );
    res.json(allCarers.rows);
  } catch (err) {
    console.log(err.message);
  }
})

app.get("/carers/getCarerBy", async (req, res) => {
  try {
    const { rating, category } = req.body;
    const result = await pool.query(
      "SELECT * FROM carers WHERE rating = $1 AND category = $2",
      [rating, category]
    );
    if (result.rows.length == 0) {
      res.send("No such carer");
    } else {
      res.json(result.rows[0]);
    }
  } catch (err) {
    console.error(err.message);
  }
})


app.get("/carers/getReviewsBy", async (req, res) => {
  try {
    const { carername } = req.body;
    const result = await pool.query(
      "SELECT rating FROM carers WHERE username = $1",
      [carername]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
