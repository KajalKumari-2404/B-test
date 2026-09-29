const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const authMiddleware = async (req, res, next) => {
  try {
    // Token from cookie
    let token = req.cookies?.token;

    // Token from Authorization header
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;

      if (authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const User = mongoose.models.user;

    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    req.user = {
      id: user._id,
      email: user.email,
    };

    next();
  } catch (error) {
    console.error("Auth middleware error:", error.message);

    return res.status(401).json({
      message: "Invalid or expired token",
    });
  }
};

module.exports = authMiddleware;