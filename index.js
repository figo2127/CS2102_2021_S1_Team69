const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

app.listen(5000, () => {
  console.log("server has started on port 5000");
})
//middleware
app.use(cors());
app.use(express.json()); //req.body

//ROUTES//

//create a todo

// app.post("/todos", async (req, res) => {
//   try {
//     const { description } = req.body;
//     const newTodo = await pool.query(
//       "INSERT INTO todo (description) VALUES($1) RETURNING *",
//       [description]
//     );

//     res.json(newTodo.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.post("/pets", async (req, res) => {
  try {
    const { pname } = req.body;
    const { owner_username } = req.body;
    const { requirements } = req.body;
    const { belongs } = req.body;
    const newPet = await pool.query(
      "INSERT INTO pets (pname, owner_username, requirements, belongs) VALUES($1, $2, $3, $4) RETURNING *",
      [pname, owner_username, requirements, belongs]
    );

    res.json(newPet.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//get all todos

// app.get("/todos", async (req, res) => {
//   try {
//     const allTodos = await pool.query("SELECT * FROM todo");
//     res.json(allTodos.rows);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.get("/pets", async (req, res) => {
  try {
    const allPets = await pool.query("SELECT * FROM pets");
    res.json(allPets.rows);
  } catch (err) {
    console.error(err.message);
  }
});

//get a todo

// app.get("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const todo = await pool.query("SELECT * FROM todo WHERE todo_id = $1", [
//       id
//     ]);

//     res.json(todo.rows[0]);
//   } catch (err) {
//     console.error(err.message);
//   }
// });

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

//update a todo

// app.put("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { description } = req.body;
//     const updateTodo = await pool.query(
//       "UPDATE todo SET description = $1 WHERE todo_id = $2",
//       [description, id]
//     );

//     res.json("Todo was updated!");
//   } catch (err) {
//     console.error(err.message);
//   }
// });

app.put("/pets/:pname", async (req, res) => {
  try {
    const { pname } = req.params;
    const { owner_username } = req.body;
    const { requirements } = req.body;
    const { belongs } = req.body;
    const updatePet = await pool.query(
      "UPDATE pets SET owner_username = $1, requirements = $2, belongs = $3 WHERE pname = $4",
      [owner_username, requirements, belongs, pname]
    );

    res.json("Pet was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//delete a todo

// app.delete("/todos/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deleteTodo = await pool.query("DELETE FROM todo WHERE todo_id = $1", [
//       id
//     ]);
//     res.json("Todo was deleted!");
//   } catch (err) {
//     console.log(err.message);
//   }
// });

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

