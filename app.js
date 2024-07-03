const express = require("express");
const app = express();

const dotenv = require("dotenv");
dotenv.config({
  path: "./.env",
});

const cors = require("cors");
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

const sequelize = require("./db/databse");

const User = require("./models/userModle");
const Task = require("./models/taskModle");

app.set("view engine", "hbs");

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

const userRoute = require("./routes/userRoute");
const taskRoute = require("./routes/taskRoute");
const excelRoute = require("./routes/excelRoute");
app.use(userRoute);
app.use(taskRoute);
app.use(excelRoute);

User.hasMany(Task);
Task.belongsTo(User, { constraints: true, onDelete: "CASCADE" });

(async () => {
  try {
    // await sequelize.sync({ force: true });
    await sequelize.sync();
    const PORT = process.env.PORT || 8000;
    app.listen(PORT, () => {
      console.log(`app listening on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to sync the database:", error);
    process.exit(1);
  }
})();
