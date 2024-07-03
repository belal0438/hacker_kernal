const User = require("../models/userModle");
const Task = require("../models/taskModle");

const sequelize = require("../db/databse");

function IsStringInvalid(str) {
  if (str == undefined || str.length === 0) {
    return true;
  } else {
    return false;
  }
}

const fetchUsers = async () => {
  return await User.findAll({
    attributes: { exclude: ["createdAt", "updatedAt"] },
  });
};

const creatTask = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { user_id, task_name, task_type } = req.body;
    const users = await fetchUsers();
    if (
      IsStringInvalid(user_id) ||
      IsStringInvalid(task_name) ||
      IsStringInvalid(task_type)
    ) {
      return res.status(403).render("add-task", {
        error: "Something is missing",
        users,
      });
    }

    const checkUser = await User.findOne({
      where: {
        id: user_id,
      },
    });

    if (!checkUser) {
      return res.status(400).render("add-task", {
        error: "User does not exist",
        users,
      });
    }

    await Task.create({ UserId: user_id, task_name, task_type });
    await t.commit();
    res.status(201).render("add-task", {
      success: "Task successfully created",
      users,
    });
  } catch (error) {
    await t.rollback();
    const users = await fetchUsers();
    res.status(500).render("add-task", {
      error: error.message,
      users,
    });
  }
};

const getAllUser = async (req, res) => {
  try {
    const users = await fetchUsers();
    res.render("add-task", { users });
  } catch (error) {
    res.status(500).render("add-task", {
      error: error.message,
    });
  }
};

const getUserTasks = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findByPk(userId, {
      include: {
        model: Task,
        attributes: { exclude: ["createdAt", "updatedAt"] },
      },
      attributes: { exclude: ["createdAt", "updatedAt"] },
    });

    if (!user) {
      return res.status(404).render("user-tasks", {
        error: "User not found",
      });
    }

    res.render("user-tasks", {
      user: user.toJSON(),
      tasks: user.Tasks,
    });
  } catch (error) {
    res.status(500).render("user-tasks", {
      error: error.message,
    });
  }
};

module.exports = {
  creatTask,
  getAllUser,
  getUserTasks,
};
