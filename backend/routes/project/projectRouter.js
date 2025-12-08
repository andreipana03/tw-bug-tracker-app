const express = require("express");
const jwt = require("jsonwebtoken");
const { verifyToken } = require("../../middlewares/auth.middlewares.js");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("./projectController.js");

const router = express.Router();



router.use(verifyToken);

// POST /projects - creaza proiect (doar MP)
router.post("/", createProject);

// GET /projects - lista proiectelor la care utilizatorul curent are acces
router.get("/", getProjects);

// GET /projects/:id - detalii proiect
router.get("/:id", getProjectById);

// PUT /projects/:id - update proiect (doar owner)
router.put("/:id", updateProject);

// DELETE /projects/:id - sterge proiect (doar owner )
router.delete("/:id", deleteProject);

module.exports = router;
