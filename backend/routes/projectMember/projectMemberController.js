const ProjectMember = require("../../models/ProjectMember.js");
const Project = require("../../models/Project.js");
const User=require("../../models/User.js")

//adaugare membru(doar ownerul proiectului poate adauga membri)
const addProjectMember = async (req, res) => {
  try {
    const { projectId, userId } = req.body;
    const project = await Project.findByPk(projectId);

    if (req.user.id !== project.ownerId) {
      return res.status(403).json({ message: "Only owner can add members" });
    }

    const existing = await ProjectMember.findOne({
      where: { projectId, userId },
    });
    if (existing) {
      return res.status(400).json({ message: "User already in the project" });
    }

    const member = await ProjectMember.create({ projectId, userId });
    res.status(201).json(memeber);
  } catch (error) {
    next(error);
  }
};

const getProjectMembers = async (req, res) => {
  try {
    const { projectId } = req.body;
    const members = await ProjectMember.findAll({
       where: { projectId },
       include: {
        model: User,
        attributes: ["id", "email", "role"]
      } });

    res.json(members);
  } catch (error) {
    next(error);
  }
};

//stergere memebru (doar ownerul are permisiune)

const deleteProjectMember = async (req, res) => {
  try {
    const { id } = req.params;

    const memeber = await ProjectMember.findByPk(id);

    if (!member) {
      return res.status(404).json({ message: "Project member not found" });
    }

    const project = await Project.findByPk(memeber.projectId);

    if (req.user.id !== project.ownerId) {
      return res.status(403).json({ message: "Only owner can remove member" });
    }

    await member.destroy();
    res.json({ message: "Member removed" });
  } catch (error) {
    next(error);
  }
};

module.exports = { addProjectMember, getProjectMembers, deleteProjectMember };
