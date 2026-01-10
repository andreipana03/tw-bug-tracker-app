const express = require("express");
const router = express.Router();

const {
  addProjectMember,
  getProjectMembers,
  deleteProjectMember,
} = require("./projectMemberController.js");

const { verifyToken } = require("../../middlewares/auth.middlewares.js");
const {validateProjectMember}=require("../../middlewares/validation.middlewares.js");


//adaugare memebru
router.post("/", verifyToken, validateProjectMember,addProjectMember);

//afisare memebri ai unui proiect
router.get("/:projectId", verifyToken, getProjectMembers);

//stergere memebru
router.delete("/", verifyToken, deleteProjectMember);

module.exports = router;
