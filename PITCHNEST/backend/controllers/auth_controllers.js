const User = require("../models/user"); // ✔️ keep as is
const bcrypt = require ("bcryptjs")  // path to secure your password 
//____________________________
// Register  page 
//----------------------------
const register = async (req, res) => {
  try {
    console.log(req.body);
    const { username, email, phone, password, age } = req.body;

    const userexist = await User.findOne({ email: email }); // ✔️ Capital U, correct method
    if (userexist) {
      return res.status(400).json({ msg: "Email already exists" });
    }
    const usercreated = await User.create({ username, email, phone, password, age }); // ✔️ fixed spelling
    // create user and create json web token 
    res.status(200).json({
  msg: "User created successfully!",
  token: await usercreated.generateToken(),
  userId: usercreated._id.toString(),
});
  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};


//____________________________
// user login logic 
//----------------------------
const login = async(req ,res) =>{
  try {
    const { email, password} =req.body;
    const userexist = await User.findOne({email});
        console.log(userexist);// 👈 ab sahi jagah par hai

    if(!userexist){
    return res.status(400).json({ msg: "invalid credentails"}); 
    }
    //else
    //const ispasvalid = await bcrypt.compare(password, userexist.password);
     const ispasvalid = await userexist.comparePassword(password);
    if(ispasvalid){
       res.status(200).json({ msg: "Login Successsfully",token:await userexist.generateToken(),userId: userexist._id.toString() });
    }
    else{
       res.status(400).json({ msg: "invalid email or password" });
    }

  } catch (error) {
         console.error("Login Error:", error); // Debug print
     res.status(500).json({ msg: "Internal server error" });
  }
}

// *-------------------
//  To send user data, User Logic
// *-------------------

const user = async (req, res) => {
  try {
    // const userData = await User.find({});
    const userData = req.user;
    console.log(userData);
    return res.status(200).json({ msg: userData });
  } catch (error) {
    console.log(` error from user route ${error}`);
  }
};
// *-------------------
//  User Profile 
// *-------------------
// ✅ Get Logged-in User Profile
const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "User not found" });
    }

    // remove password field
    const { password, ...userData } = req.user._doc;
    res.status(200).json(userData);
  } catch (error) {
    console.error("Profile fetch error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
// ✅ Export both together in a single object
module.exports = {
  register,
  login,
  user,
  getUserProfile, // ✅ add this export
};
