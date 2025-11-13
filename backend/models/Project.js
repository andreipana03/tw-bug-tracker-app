const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const User = require('./User.js');

const Project = sequelize.define('Project', {
  projectName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  repositoryName: {
    type: DataTypes.STRING,
    allowNull: false
  }
});

Project.belongsTo(User, { foreignKey: 'ownerId' }); // fiecare proiect are un owner
User.hasMany(Project, { foreignKey: 'ownerId' });

module.exports = Project;
