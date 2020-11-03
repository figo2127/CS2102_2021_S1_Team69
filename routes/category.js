const router = require('express').Router();
const { authUser, authAdmin } = require('./verifyToken');
const pool = require("../db");

//add a new category
router.post("/", authUser, authAdmin, async (req, res) => {
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
router.get("/", async (req, res) => {
    try {
      const allCategories = await pool.query("SELECT * FROM categories;");
      res.json(allCategories.rows);
    } catch (err) {
      console.error(err.message);
    }
});
  

module.exports = router;