const express = require("express");
const jwt = require("jsonwebtoken");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  deleteProject,
} = require("./projectController.js");

const router = express.Router();

// Simple JWT auth middleware (similar secret as in loginUser)
const authenticate = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ message: "Authorization header missing" });
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res.status(401).json({ message: "Invalid Authorization header format" });
  }

  jwt.verify(token, process.env.JWT_SECRET || "secretkey", (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: "Invalid or expired token" });
    }
    // decoded should contain { id, role }
    req.user = decoded;
    next();
  });
};

// aplicare auth tuturor rutelor
router.use(authenticate);

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
