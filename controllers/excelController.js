const User = require("../models/userModle");
const Task = require("../models/taskModle");
const ExcelJS = require("exceljs");

const exportUsersTasks = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["createdAt", "updatedAt"] },
      include: [
        { model: Task, attributes: { exclude: ["createdAt", "updatedAt"] } },
      ],
    });

    const workbook = new ExcelJS.Workbook();
    const userSheet = workbook.addWorksheet("Users");
    const taskSheet = workbook.addWorksheet("Tasks");

    userSheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "Name", key: "name", width: 30 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile", key: "mobile", width: 15 },
    ];

    taskSheet.columns = [
      { header: "ID", key: "id", width: 10 },
      { header: "UserID", key: "UserId", width: 10 },
      { header: "Task Name", key: "task_name", width: 30 },
      { header: "Task Type", key: "task_type", width: 10 },
    ];

    users.forEach((user) => {
      userSheet.addRow(user.toJSON());
      user.Tasks.forEach((task) => {
        taskSheet.addRow(task.toJSON());
      });
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=users_tasks.xlsx"
    );

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    res.status(500).send("Error exporting data");
  }
};

module.exports = { exportUsersTasks };
