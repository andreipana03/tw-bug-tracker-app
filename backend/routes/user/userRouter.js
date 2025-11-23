const express = require('express');
const router=express.Router();

const {
  registerUser,
  loginUser,
  getUserById

}=require('./userController.js');

const {validateRegister,validateLogin}=require('../../middlewares/validation.middlewares.js');

//inregistrare utilizator
router.post('/',validateRegister,registerUser);

//autentificare
router.post('/login',validateLogin,loginUser);

//detalii utilizator
router.get('/:id',getUserById);

module.exports=router;