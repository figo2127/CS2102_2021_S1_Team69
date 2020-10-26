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
    const {username} = req.body;
    const {password} = req.body;
    const {name} = req.body;
    const {phone} = req.body;
    const {area} = req.body;
    const {address} = req.body;
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
    const {username} = req.body;
    const {password} = req.body;
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
    const {username} = req.body;
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
    const {username} = req.body;
    const {password} = req.body;
    const {name} = req.body;
    const {phone} = req.body;
    const {area} = req.body;
    const {address} = req.body;
    const updateOwnerInfo = await pool.query(
      "UPDATE accounts SET password = $2, name = $3, phone = $4, area = $5, address = $6 WHERE username = $7",
      [password, name, phone, area, address, username]
    );
    res.send("Owner info updated successfully")
  } catch (err) {
    console.error(err.message);
  }
})

app.get("/admin", async (req, res) => {
  try {
    const allAdmin = await pool.query("SELECT * FROM admin");
    res.json(allAdmin.rows);
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

/**
 * Demo todo apis
 */
//create a todo

app.post("/todos", async (req, res) => {
  try {
    const { description } = req.body;
    const newTodo = await pool.query(
      "INSERT INTO todo (description) VALUES($1) RETURNING *",
      [description]
    );

    res.json(newTodo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all todos

app.get("/todos", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo

app.get("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
      id
    ]);

    res.json(todo.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//update a todo

app.put("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;
    const updateTodo = await pool.query(
      "UPDATE todo SET description = $1 WHERE todo_id = $2",
      [description, id]
    );

    res.json("Todo was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

app.delete("/todos/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
      id
    ]);
    res.json("Todo was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

app.listen(5000, () => {
  console.log("server has started on port 5000");
});
