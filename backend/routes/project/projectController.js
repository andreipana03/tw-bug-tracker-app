const Project = require("../../models/Project.js");
const User = require("../../models/User.js");

// POST /projects - create project (only MP)
const createProject = async (req, res, next) => {
  try {
    const { projectName, repositoryName } = req.body;

    if (!projectName || !repositoryName) {
      return res.status(400).json({ message: "projectName and repositoryName are required" });
    }

    // validare - doar MP poate sa creeze proiecte
    if (req.user.role !== "MP") {
      return res.status(403).json({ message: "Only MP users can create projects" });
    }

    // ownerul proiectului este mereu utilizatorul care creeaza proiectul
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

    const projects = await Project.findAll({
      where: { ownerId: userId },
      include: [
        {
          model: User,
          attributes: ["id", "email", "role"],
        },
      ],
    });

    res.json(projects);
  } catch (error) {
    next(error);
  }
};

// GET /projects/:id - detalii proiect
// For now: returns project + owner; members & bugs left as TODO
const getProjectById = async (req, res, next) => {
  try {
    const projectId = req.params.id;

    const project = await Project.findByPk(projectId, {
      include: [
        {
          model: User,
          attributes: ["id", "email", "role"],
        },
      ],
    });

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: "You do not have access to this project" });
    }

    // If you later add ProjectMember / Bug models, you can include them here.
    const response = {
      id: project.id,
      projectName: project.projectName,
      repositoryName: project.repositoryName,
      ownerId: project.ownerId,
      owner: project.User
        ? {
            id: project.User.id,
            email: project.User.email,
            role: project.User.role,
          }
        : null,
      members: [], // TODO: fill with real team members when you add a model
      bugs: [], // TODO: fill with real bugs when you add a model
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

    // Doar ownerul poate modifica
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Only the project owner can modify this project" });
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

    // Doar ownerul poate sterge proiectul
    if (project.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Only the project owner can delete this project" });
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
