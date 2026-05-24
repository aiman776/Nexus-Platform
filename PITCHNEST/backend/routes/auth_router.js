const express = require("express");
const router = express.Router();

// ✅ Import the whole controller object
const authcontroller = require("../controllers/auth_controllers");
const  signup_schema  = require("../validators/auth_validators");
const validate = require("../middlewares/validate-middleware");

const { authMiddleware } = require("../middlewares/auth-middleware");


// ✅ Define routes correctly

router.post("/register", validate(signup_schema), authcontroller.register);
router.post("/login", authcontroller.login);
// 🛠️ Fixed this line below:
router.get("/user", authMiddleware, authcontroller.user);
// ✅ Get user profile route
router.get("/profile", authMiddleware, (req, res) => {
  res.json(req.user);
});

module.exports = router;

