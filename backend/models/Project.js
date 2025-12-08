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


Project.belongsTo(User, { as: 'owner', foreignKey: 'ownerId' });
User.hasMany(Project, { as: 'ownedProjects', foreignKey: 'ownerId' });

module.exports = Project;
