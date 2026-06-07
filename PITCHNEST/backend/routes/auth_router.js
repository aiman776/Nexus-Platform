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


router.put("/change-password", authMiddleware, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    const isValid = await user.comparePassword(currentPassword);
    if (!isValid) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully!" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;