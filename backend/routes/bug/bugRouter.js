const express = require("express");
const router = express.Router();

const {
  createBug,
  getBugs,
  getBugById,
  updateBug,
  deleteBug
} = require("./bugController.js");

const { verifyToken } = require("../../middlewares/auth.middlewares.js"); 

router.use(verifyToken);

//adaugare bug(doar TST)
router.post("/", createBug);

//afisare bugs
router.get("/", getBugs);

//afisare detalii bug
router.get("/:id", getBugById);

//modificare bug
router.put("/:id", updateBug);

//stergere bug
router.delete("/:id", deleteBug);

module.exports = router;