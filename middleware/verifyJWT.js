const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT = (req, res, next) => {
  console.log("ACCESS_TOKEN_SECRET = ", process.env.ACCESS_SECRET_KEY);
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({message:"Unauthorized token"});
  console.log(authHeader); // Bearer token
  const token = authHeader.split(" ")[1];
  jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, decoded) => {
    if (err) return res.status(401).json({message:"Invalid token"+err.message});
    req.user = decoded.userData;
    next();
  });
}

module.exports = verifyJWT;