const jwt = require("jsonwebtoken");
const User = require("../models/user");

const authMiddleware = async (req, res, next) => {
  try {
    let token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({ message: "Unauthorized: No token provided" });
    }

    // ✅ Fix: Handle "Bearer " safely (both lowercase/uppercase)
    if (token.toLowerCase().startsWith("bearer ")) {
      token = token.slice(7).trim(); // remove 'Bearer '
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    // ✅ Find user from decoded email
    const user = await User.findOne({ email: decoded.email }).select("-password");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // ✅ Attach user details to request
    req.user = user;
    req.token = token;
    req.userID = decoded.userid; // same field name as in user.js

    next();
  } catch (error) {
    console.error("Auth error:", error.message);
    res.status(401).json({ message: "Unauthorized. Invalid or malformed token." });
  }
};

module.exports = { authMiddleware };
