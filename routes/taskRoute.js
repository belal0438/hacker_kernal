const express = require("express");
const router = express.Router();
const taskController = require("../controllers/taskController");

router.get("/add-task", taskController.getAllUser);
router.post("/add-task", taskController.creatTask);
router.get("/user/:id/tasks", taskController.getUserTasks);

module.exports = router;
