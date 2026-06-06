const express = require("express");
const router = express.Router();
const { getProfile, updateProfile } = require("../controllers/profile_controller");
const { authMiddleware } = require("../middlewares/auth-middleware");

// ✅ GET  /api/profile      → apni profile dekho
// ✅ PUT  /api/profile      → profile update karo

router.get("/", authMiddleware, getProfile);
router.put("/", authMiddleware, updateProfile);

module.exports = router;