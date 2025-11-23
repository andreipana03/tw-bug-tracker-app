const errorHandler=(err,req,res,next)=>{
  console.log(err);
  const statusCode=err.statusCode || 500;
  const message = err.message || "Server error";
  res.status(statusCode).json({ message });
};

module.exports={errorHandler};