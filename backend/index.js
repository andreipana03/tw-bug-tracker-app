require('dotenv').config();

const express = require('express');
const sequelize = require('./db.js');
const User = require('./models/User.js');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Backend-ul functioneaza!');
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexiunea la baza de date a fost stabilita cu succes');

    await sequelize.sync(); 

    console.log('Modelele au fost sincronizate');

    app.listen(PORT, () => {
      console.log(`Serverul ruleaza pe http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error('Nu s-a putut porni serverul:', error);
  }
};

startServer();