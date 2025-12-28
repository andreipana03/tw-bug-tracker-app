const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  getUserById,
  getAllUsers,
} = require("./userController.js");

const {
  validateRegister,
  validateLogin,
} = require("../../middlewares/validation.middlewares.js");

//inregistrare utilizator
router.post("/", validateRegister, registerUser);

//autentificare
router.post("/login", validateLogin, loginUser);

//detalii utilizator
router.get("/:id", getUserById);

//afisare utilizatori
router.get("/", getAllUsers);

module.exports = router;
