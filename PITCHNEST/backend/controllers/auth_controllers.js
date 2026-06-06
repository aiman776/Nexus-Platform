const User = require("../models/user");
const bcrypt = require("bcryptjs");

// ✅ Register
const register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, phone, password, age, role } = req.body;

    const userexist = await User.findOne({ email: email });
    if (userexist) {
      return res.status(400).json({ msg: "Email already exists" });
    }

    const usercreated = new User({
      username,
      email,
      phone,
      password,
      age,
      role: role || "entrepreneur"
    });
    await usercreated.save();

    res.status(200).json({
      msg: "User created successfully!",
      token: await usercreated.generateToken(),
      userId: usercreated._id.toString(),
      role: usercreated.role,
    });
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// ✅ Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userexist = await User.findOne({ email });
    console.log(userexist);

    if (!userexist) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const ispasvalid = await userexist.comparePassword(password);
    if (ispasvalid) {
      res.status(200).json({
        msg: "Login Successfully",
        token: await userexist.generateToken(),
        userId: userexist._id.toString(),
        role: userexist.role,
      });
    } else {
      res.status(400).json({ msg: "Invalid email or password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

// ✅ User data
const user = async (req, res) => {
  try {
    const userData = req.user;
    console.log(userData);
    return res.status(200).json({ msg: userData });
  } catch (error) {
    console.log(`error from user route ${error}`);
  }
};

// ✅ Get User Profile
const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }
    // ✅ Fix: _doc ki jagah toObject()
    const userObj = req.user.toObject();
    const { password, ...userData } = userObj;
    res.status(200).json(userData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  register,
  login,
  user,
  getUserProfile,
};