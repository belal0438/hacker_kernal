const { DataTypes } = require("sequelize");
const sequelize = require("../db/databse");

const Task = sequelize.define("Task", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  task_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  task_type: {
    type: DataTypes.ENUM("Pending", "Done"),
    allowNull: false,
    default: "Pending",
  },
});

module.exports = Task;
