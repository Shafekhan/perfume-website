const jwt = require("jsonwebtoken");
require("dotenv").config();
const secret = process.env.SECRET;

const Authentication = async (req, res, next) => {
  const isTokenPresent = req.headers.authorization;
  if (!isTokenPresent) {
    return res.status(404).json({ msg: "User is not Authenticated" });
  }
  
  const token = isTokenPresent.split(" ")[1];

  if (!token) {
    return res.status(404).json({ msg: "User is not Authenticated" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token", err: err.message });
    }

    if (decoded?.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(401).json({ message: "Invalid token" });
    }
  });
};

module.exports = { Authentication };
