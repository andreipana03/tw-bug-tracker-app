require("dotenv").config();

const express = require("express");
const cors = require("cors");
const sequelize = require("./db.js");
const User = require("./models/User.js");
const Project = require("./models/Project.js");
const Bug = require("./models/Bug.js");
const ProjectMember = require("./models/ProjectMember.js");
const userRoutes = require("./routes/user/userRouter.js");
const projectMemberRoutes = require("./routes/projectMember/projectMemberRouter.js");
const projectRoutes = require("./routes/project/projectRouter.js");
const bugRouter = require("./routes/bug/bugRouter.js");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use("/api/users", userRoutes);
app.use("/api/project-members", projectMemberRoutes);
app.use("/api/project", projectRoutes);
app.use("/api/bugs", bugRouter);

app.get("/", (req, res) => {
  res.send("Backend-ul functioneaza!");
});

const { errorHandler } = require("./middlewares/error.middlewares.js");
app.use(errorHandler);

const startServer = async () => {
  try {
    // Creeaza baza de date daca nu exista
    await sequelize.query(
      `CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`
    );

    //Se realizeaza conexiunea la baza de date
    await sequelize.authenticate();
    console.log("Conexiunea la baza de date a fost stabilita cu succes");

    //Creeaza tabelele
    await sequelize.sync();

    console.log("Modelele au fost sincronizate");

    //Porneste serverul
    app.listen(PORT, () => {
      console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Nu s-a putut porni serverul:", error);
  }
};

startServer();
