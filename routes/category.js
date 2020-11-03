const router = require('express').Router();
const { authUser, authAdmin } = require('./verifyToken');
const pool = require("../db");

//add a new category
//tested
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

//update a category
//tested
router.put("/:category_name", authUser, authAdmin, async (req, res) => {
  try {
    const { category_name  } = req.params;
    const { base_price } = req.body;
    const updateCategory = await pool.query(
      "UPDATE categories SET base_price = $1 WHERE category_name = $2",
      [base_price, category_name]
    );
    res.json("Category was updated!");
  } catch (err) {
    console.error(err.message);
  }
});

//get all categories
//tested
router.get("/", async (req, res) => {
    try {
      const allCategories = await pool.query("SELECT * FROM categories;");
      res.json(allCategories.rows);
    } catch (err) {
      console.error(err.message);
    }
});

//get a category by category_name
//tested
router.get("/:category_name", async (req, res) => {
  try {
    const { category_name } = req.params;
    const category = await pool.query("SELECT * FROM categories WHERE category_name = $1", [category_name]);
    res.json(category.rows[0]);
  } catch (err) {
    console.error(err.message);
  }
});

//delete a category
//tested
router.delete("/:category_name", authUser, authAdmin, async (req, res) => {
  try {
    const { category_name } = req.params;
    const deleteCategory = await pool.query("DELETE FROM categories WHERE category_name = $1", [
      category_name
    ]);
    res.json("Category was deleted!");
  } catch (err) {
    console.log(err.message);
  }
});
  

module.exports = router;