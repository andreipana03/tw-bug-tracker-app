const { DataTypes } = require('sequelize');
const sequelize = require('../db.js');
const User = require('./User.js');
const Project = require('./Project.js');

const ProjectMember = sequelize.define('ProjectMember', {});

User.belongsToMany(Project, { through: ProjectMember, as: 'memberProjects', foreignKey: 'userId' });//un user(mp) poate face parte din mai multe proiecte
Project.belongsToMany(User, { through: ProjectMember, as: 'members', foreignKey: 'projectId' });//un proiect poate avea mai multi membri

ProjectMember.belongsTo(User, { foreignKey: 'userId' });
ProjectMember.belongsTo(Project, { foreignKey: 'projectId' });

module.exports = ProjectMember;