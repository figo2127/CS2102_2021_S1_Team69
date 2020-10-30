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
app.get("/owners/:username", async (req, res) => {
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
app.put("/owners/:username", async (req, res) => {
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
app.post("/creditcard", async (req, res) => {
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
app.get("/creditcard/:owner_name", async (req, res) => {
  try {
    const { owner_name } = req.params;
    const result = await pool.query(
      "SELECT * FROM credit_card WHERE owner_username = $1;",
      [owner_name]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
  }
})

// update creditcard info
app.put("/creditcard/:credit_card_num", async (req, res) => {
  try {
    const { username, credit_card_num, expiry_date, cvv } = req.body;
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
    const { username, credit_card_num } = req.body;
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
app.get("/carers/get-list-of-carer", async (req, res) => {
  try {
    const allCarers = await pool.query(
      "SELECT * FROM carers"
    );
    res.json(allCarers.rows);
  } catch (err) {
    console.log(err.message);
  }
})

app.get("/carers/get-carer-by", async (req, res) => {
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

//get all reviews for a carer sort by review_rating
app.get("/carers/:carername", async (req, res) => {
  try {
    const { carername } = req.body;
    const result = await pool.query(
      "SELECT review_rating, review_content, review_date FROM bids WHERE carer_name = $1 ORDER BY review_rating DESC",
      [carername]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})

//get all reviews for a carer sorted by date
app.get("/reviews/carers/:carer_name", async (req, res) => {
  try {
    const { carer_name } = req.params;
    const result = await pool.query(
      "SELECT review_rating, review_content FROM bids WHERE carer_name = $1 AND review_rating IS NOT NULL ORDER BY review_date DESC",
      [carer_name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
})

// create a pet
app.post("/pets", async (req, res) => {
  try {
    const { pname, ownername, requirements, belongs } = req.body;
    const newPet = await pool.query(
      "INSERT INTO pets (pname, ownername, requirements, belongs) VALUES($1, $2, $3, $4) RETURNING *",
      [pname, ownername, requirements, belongs]
    );
    res.json(newPet.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// get all pets
app.get("/pets", async (req, res) => {
  try {
    const allPets = await pool.query("SELECT * FROM pets");
    res.json(allPets.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get a pet
app.get("/pets/:pname", async (req, res) => {
  try {
    const { pname } = req.params;
    const pet = await pool.query("SELECT * FROM pets WHERE pname = $1", [
      pname
    ]);
    res.json(pet.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update a pet
app.put("/pets/:pname", async (req, res) => {
  try {
    const { pname, ownername, requirements, belongs } = req.params;
    const updatePet = await pool.query(
      "UPDATE pets SET ownername = $1, requirements = $2, belongs = $3 WHERE pname = $4",
      [ownername, requirements, belongs, pname]
    );
    res.json("Pet was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a pet
app.delete("/pets/:pname", async (req, res) => {
  try {
    const { pname } = req.params;
    const deletePet = await pool.query("DELETE FROM pets WHERE pname = $1", [
      pname
    ]);
    res.json("Pet was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

//3. rank owner money spend per month beining
app.get("/owners/spend/:month/:year", async (req, res) => {
  try {
    const { month, year } = req.params;
    const owners = await pool.query(`
      SELECT owner_name, SUM((end_date - start_date)*daily_price) AS money_spend
      FROM bids WHERE is_sucessful = True 
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

//6. get all review given by a owner sort by date beining
app.get("/reviews/owners/:owner_name", async (req, res) => {
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

/**
 * get the number of pet days of a carer in current month
 */
app.get("/carers/getpetday", async (req, res) => {
  try {
    var today = new Date();
    var currentYear = today.getFullYear();
    var currentMonth = today.getMonth();
    // var startOfMonth = currentYear + "-" + ('0' + (currentMonth + 1)).slice(-2) + "-" + "01";
    // var endOfMonth = currentYear + "-" + ('0' + (currentMonth + 1)).slice(-2) + "-" + ('0' + getDaysInMonth(currentMonth + 1, currentYear)).slice(-2);
    var startOfMonthDate = new Date(currentYear, currentMonth, "01");
    var startOfNextMonthDate = new Date(currentYear, currentMonth + 1, "01");
    const {carername} = req.body;
    const result = await pool.query(
      "SELECT * FROM bids WHERE carer_name = $1 and EXTRACT(year from start_date) = $2 and EXTRACT(year from end_date) = $2, and (EXTRACT(month from start_date) = $3 OR EXTRACT(month from end_date) = $3)",
      [carername, currentYear, currentMonth]
    );
    var sum = 0;
    var tuples = res.rows[0]; //array of pairs of start date and end date
    for (var i = 0; i < tuples.length; i++) {
      var start = tuples[i][0]; // start date of a pair
      var end = tuples[i][1]; // end date of a pair
      var actualStart = max(startOfMonthDate, start);
      var actualEnd = min(startOfNextMonthDate, end);
      var days = actualEnd - actualStart;
      sum += days;
    }
    res.send(sum);
  } catch (err) {
    console.error(err.message);
  }
})

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
