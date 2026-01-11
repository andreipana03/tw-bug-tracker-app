const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const Project = require('./Project.js');
const User = require('./User.js');

const Bug = sequelize.define('Bug', {
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  priority: {
    type: DataTypes.STRING,
    allowNull: false
  },
  severity: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: "Medium"
  },
  commit_link: {
    type: DataTypes.STRING
  },
  bugStatus: {
    type: DataTypes.STRING,
    defaultValue: 'ToDo'
  }
});

Bug.belongsTo(Project, { foreignKey: 'projectId' });//un bug este alocat unui proiect
Project.hasMany(Bug, { foreignKey: 'projectId' });//un proiect poate avea mai multe bugguri

Bug.belongsTo(User, { as: 'reporter', foreignKey: 'reporterId' });//un singur user poate raporta buggul
Bug.belongsTo(User, { as: 'assignedTo', foreignKey: 'assignedToId' });//unui singur user ii este alocata rezolvarea buggului

module.exports = Bug;
