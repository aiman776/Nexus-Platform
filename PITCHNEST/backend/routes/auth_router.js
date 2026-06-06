const express = require("express");
const router = express.Router();

const authcontroller = require("../controllers/auth_controllers");
const signup_schema = require("../validators/auth_validators");
const validate = require("../middlewares/validate-middleware");
const { authMiddleware } = require("../middlewares/auth-middleware");

router.post("/register", validate(signup_schema), authcontroller.register);
router.post("/login", authcontroller.login);
router.get("/user", authMiddleware, authcontroller.user);

// ✅ getUserProfile use karo
router.get("/profile", authMiddleware, authcontroller.getUserProfile);

// ✅ ID se kisi bhi user ka profile fetch karo
router.get("/user/:id", authMiddleware, async (req, res) => {
  try {
    const User = require("../models/user");
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;