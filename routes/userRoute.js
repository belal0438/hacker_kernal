const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.get("/add-user", (req, res) => {
  res.render("add-user");
});
router.post("/add-user", userController.creatUser);

module.exports = router;
