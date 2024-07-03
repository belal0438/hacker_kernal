const User = require("../models/userModle");
const sequelize = require("../db/databse");

function IsStringInvalid(str) {
  if (str == undefined || str.length === 0) {
    return true;
  } else {
    return false;
  }
}

const creatUser = async (req, res) => {
  const t = await sequelize.transaction();
  try {
    const { name, email, mobile } = req.body;

    console.log(">>>>>>>>>>", name, email, mobile);

    if (
      IsStringInvalid(name) ||
      IsStringInvalid(mobile) ||
      IsStringInvalid(email)
    ) {
      return res.status(400).render("add-user", {
        error: "Something is missing",
      });
    }

    const checkUser = await User.findOne({
      where: {
        email,
      },
    });

    if (checkUser) {
      return res.status(400).render("add-user", {
        error: "User already exists",
      });
    }

    await User.create({ name, email, mobile });
    await t.commit();
    res.status(201).render("add-task", {
      success: "User created successfully. Please add a task.",
    });
  } catch (error) {
    await t.rollback();
    res.status(500).render("add-user", {
      error: error.message,
    });
  }
};

module.exports = {
  creatUser,
};
