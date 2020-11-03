const router = require('express').Router();
const { authUser } = require('./verifyToken');
const pool = require("../db");

// create a pet
// {
//     "owner_name" : "superadmin",
//     "pname" : "manman",
//     "requirements" : "feed 4 times a day",
//     "belong" : "cat"
// }
router.post("/", authUser, async (req, res) => {
    try {
      const { pname, owner_name, requirements, belongs } = req.body;
      const newPet = await pool.query(
        "INSERT INTO pets (pname, owner_name, requirements, belongs) VALUES($1, $2, $3, $4) RETURNING *",
        [pname, owner_name, requirements, belongs]
      );
      res.json(newPet.rows[0]);
    } catch (err) {
      console.error(err.message);
    }
  });


// get all pets
router.get("/", async (req, res) => {
  try {
    const allPets = await pool.query("SELECT * FROM pets");
    res.json(allPets.rows);
  } catch (err) {
    console.error(err.message);
  }
});

// get a pet
router.get("/:owner_name/:pname", async (req, res) => {
  try {
    const { owner_name, pname } = req.params;
    const pet = await pool.query("SELECT * FROM pets WHERE owner_name = $1 AND pname = $2", [
        owner_name, pname
    ]);
    res.json(pet.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

// update a pet
router.put("/:owner_name/:pname", authUser, async (req, res) => {
  try {
    const { owner_name, pname } = req.params;
    console.log(req.body);
    const { requirements, belongs } = req.body;
    const updatePet = await pool.query(
      "UPDATE pets SET requirements = $1, belongs = $2 WHERE owner_name = $3 AND pname = $4",
      [requirements, belongs, owner_name, pname]
    );
    res.json("Pet was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

// delete a pet
router.delete("/:owner_name/:pname", authUser, async (req, res) => {
  try {
    const { owner_name, pname } = req.params;
    const deletePet = await pool.query("DELETE FROM pets WHERE owner_name = $1 AND pname = $2", [
        owner_name, pname
    ]);
    res.json("Pet was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});

module.exports = router;