const express = require("express");
const router = express.Router();
const exportController = require("../controllers/excelController");

router.get("/export-users-tasks", exportController.exportUsersTasks);

module.exports = router;
