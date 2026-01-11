const Project = require("../../models/Project.js");
const User = require("../../models/User.js");
const ProjectMember = require("../../models/ProjectMember.js");
const Bug = require("../../models/Bug.js");

// POST /projects - create project (only MP)
const createProject = async (req, res, next) => {
  try {
    const { projectName, repositoryName } = req.body;

    if (!projectName || !repositoryName) {
      return res
        .status(400)
        .json({ message: "projectName and repositoryName are required" });
    }

    if (req.user.role !== "MP") {
      return res
        .status(403)
        .json({ message: "Only MP users can create projects" });
    }

    const ownerId = req.user.id;

    const project = await Project.create({
      projectName,
      repositoryName,
      ownerId,
    });

    res.status(201).json(project);
  } catch (error) {
    next(error);
  }
};

// GET /projects - lista proiectelor la care userul are acces
// For now: all projects where user is owner
const getProjects = async (req, res, next) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    if (userRole === "TST") {
      const allProjects = await Project.findAll({
        include: [
          { model: User, as: "owner", attributes: ["id", "email", "role"] },
          { model: User, as: "members", attributes: ["id"] },
        ],
      });
      return res.json(allProjects);
    }

    const owned = await Project.findAll({
      where: { ownerId: userId },
      include: [
        { model: User, as: "owner", attributes: ["id", "email", "role"] },
        { model: User, as: "members", attributes: ["id", "email", "role"] },
      ],
    });


  } catch (error) {
    next(error);
  }
};

// GET /projects/:id - detalii proiect
// For now: returns project + owner; members & bugs left as TODO
const getProjectById = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const userId = req.user.id;

    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: User,
          as: "owner",
          attributes: ["id", "email", "role"],
        },
        {
          model: User,
          as: "members",
          attributes: ["id", "email", "role"],
          through: { attributes: [] },
        },
        {
          model: Bug,
          attributes: [
            "id",
            "description",
            "priority",
            "severity",
            "bugStatus",
            "commit_link",
            "assignedToId",
          ],
          include: [
            {
              model: User,
              as: "assignedTo",
              attributes: ["id", "email"],
            },
          ],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    const isOwner = project.ownerId === userId;

    const isMember = await ProjectMember.findOne({
      where: { projectId, userId },
    });

    if (!isOwner && !isMember) {
      return res
        .status(403)
        .json({ message: "You do not have access to this project" });
    }



    const response = {
      id: project.id,
      projectName: project.projectName,
      repositoryName: project.repositoryName,
      owner: project.owner
        ? {
            id: project.owner.id,
            email: project.owner.email,
            role: project.owner.role,
          }
        : null,
      members:
        project.members?.map((m) => ({
          id: m.id,
          email: m.email,
          role: m.role,
        })) || [],
      bugs:
        project.Bugs?.map((b) => ({
          id: b.id,
          description: b.description,
          priority: b.priority,
          severity: b.severity,
          bugStatus: b.bugStatus,
          commit_link: b.commit_link,
          assignedToId: b.assignedToId,
          assignedTo: b.assignedTo ? { id: b.assignedTo.id, email: b.assignedTo.email } : null,
        })) || [],
      createdAt: project.createdAt,
      updatedAt: project.updatedAt,
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
};

// PUT /projects/:id - modifica proiectul (doar owner)
const updateProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;
    const { projectName, repositoryName } = req.body;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the project owner can modify this project" });
    }

    if (projectName !== undefined) {
      project.projectName = projectName;
    }
    if (repositoryName !== undefined) {
      project.repositoryName = repositoryName;
    }

    await project.save();

    res.json(project);
  } catch (error) {
    next(error);
  }
};

// DELETE /projects/:id - sterge proiect (doar owner)
const deleteProject = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerId !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Only the project owner can delete this project" });
    }

    await project.destroy();

    res.json({ message: "Project deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
};
