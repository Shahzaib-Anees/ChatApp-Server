import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
// authenticate user middleware
const authenticate = async (req, res, next) => {
  const token = req.headers["authorization"] || req.headers["Authorization"];
  console.log("token", token);

  if (!token) return res.status(404).json({ message: "no token found" });

  jwt.verify(token, process.env.JWT_ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      console.log(err);
      return res.status(403).json({ message: "invalid token" });
    }
    req.user = user;
    next();
  });
};

export { authenticate };
