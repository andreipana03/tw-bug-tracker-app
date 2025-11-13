require('dotenv').config();

const express = require('express');
const sequelize = require('./db.js');
const User = require('./models/User.js');
const Project = require('./models/Project.js');
const Bug = require('./models/Bug.js');
const ProjectMember = require('./models/ProjectMember.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend-ul functioneaza!');
});

const startServer = async () => {
  try {

    // Creeaza baza de date daca nu exista
    await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME}`);

    //Se realizeaza conexiunea la baza de date
    await sequelize.authenticate();
    console.log('Conexiunea la baza de date a fost stabilita cu succes');

    //Creeaza tabelele
    await sequelize.sync({ alter: true }); 

    console.log('Modelele au fost sincronizate');

    //Porneste serverul
    app.listen(PORT, () => {
      console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Nu s-a putut porni serverul:', error);
  }
};

startServer();