
const Project=require("../models/Project.js");
const User=require("../models/User.js");

const validateRegister = (req, res, next) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  //parola minim 6 caractere
  if (password.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters long" });
  }

  //rol valid
  const alloweRoles = ["MP", "TST"];
  if (!alloweRoles.includes(role)) {
    return res.status(400).json({ message: "Role must be either MP or TST" });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  next();
};

const validateProjectMember= async (req,res,next)=>{
  const{projectId,userId}=req.body;

  if(!projectId || !userId){
    return res.status(400).json({message:"ProjectId and userId are required"});
  }

  const project=await Project.findByPk(projectId);
  if(!project){
    return res.status(404).json({message:"Project not found"});
  }

  const user= await User.findByPk(userId);
  if(!user){
    return res.status(404).json({ message: "User not found" });
  }

  next();
};

module.exports = { validateRegister, validateLogin,validateProjectMember };
