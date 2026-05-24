const mongoose = require('mongoose');
const bcrypt = require ("bcryptjs")  // path to secure your password 


const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age:{type: Number},
     phone: { type: String, required: true },
    isadmin:{type:Boolean, default: false},
});

 // 2nd method for hash password--- Pre method---work as middle way 
   UserSchema.pre("save", async function(next){
    //console.log("pre_method", this);
    const user = this;
    if(!user.isModified("password")){
        next();
    }
    //else
    try {
    const saltround = await bcrypt.genSalt(10);
    const hash_password =await bcrypt.hash(user.password, saltround);
    user.password= hash_password;
    }
    catch (error) {
        next(error)
    }  });


// json web token 
const jwt = require("jsonwebtoken");

UserSchema.methods.generateToken = async function () {
  try {
    return jwt.sign(
      {
        userid: this._id.toString(),
        email: this.email,
        isadmin: this.isadmin,
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "30d" } // optional, but recommended
    );
  } catch (error) {
    console.error("JWT Error:", error);
  }
};

//campare the password for login user 
UserSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
}

const User =new mongoose.model("User", UserSchema);
module.exports = User; 
