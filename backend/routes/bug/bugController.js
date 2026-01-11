const Bug = require("../../models/Bug.js");
const Project = require("../../models/Project.js");
const User = require("../../models/User.js");

const createBug = async (req, res, next) => {
  try {
    const { description, priority, severity, commit_link, projectId } = req.body;
    
    if (req.user.role !== 'TST') {
       return res.status(403).json({ message: "Only TST users can report bugs" });
    }

    const project = await Project.findByPk(projectId);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const newBug = await Bug.create({
      description,
      priority,
      severity,
      commit_link,
      projectId,
      reporterId: req.user.id,
      bugStatus: "ToDo"
    });

    res.status(201).json(newBug);
  } catch (error) {
    next(error);
  }
};

const getBugs = async (req, res, next) => {
  try {
    const { projectId } = req.query;
    const whereClause = {};

    if (projectId) {
      whereClause.projectId = projectId;
    }

    const bugs = await Bug.findAll({
      where: whereClause,
      include: [
        { model: User, as: 'reporter', attributes: ['id', 'email'] },
        { model: User, as: 'assignedTo', attributes: ['id', 'email'] }
      ]
    });

    res.json(bugs);
  } catch (error) {
    next(error);
  }
};

const getBugById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bug = await Bug.findByPk(id, {
        include: [
            { model: Project, attributes: ['projectName'] },
            { model: User, as: 'reporter', attributes: ['email'] },
            { model: User, as: 'assignedTo', attributes: ['email'] }
        ]
    });

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    res.json(bug);
  } catch (error) {
    next(error);
  }
};

const updateBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { bugStatus, priority, commit_link, assignedToId } = req.body;

    const bug = await Bug.findByPk(id);
    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    if (req.user.role !== 'MP') {
        return res.status(403).json({ message: "Only MP users can update bugs" });
    }

    if (bugStatus !== undefined) bug.bugStatus = bugStatus;
    if (priority !== undefined) bug.priority = priority;
    if (commit_link !== undefined) bug.commit_link = commit_link;
    if (assignedToId !== undefined) bug.assignedToId = assignedToId;

    await bug.save();
    res.json(bug);
  } catch (error) {
    next(error);
  }
};

const deleteBug = async (req, res, next) => {
  try {
    const { id } = req.params;
    const bug = await Bug.findByPk(id);

    if (!bug) {
      return res.status(404).json({ message: "Bug not found" });
    }

    if (req.user.role !== 'MP') {
        return res.status(403).json({ message: "Only MP users can delete bugs" });
    }

    await bug.destroy();
    res.json({ message: "Bug deleted" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBug,
  getBugs,
  getBugById,
  updateBug,
  deleteBug
};  