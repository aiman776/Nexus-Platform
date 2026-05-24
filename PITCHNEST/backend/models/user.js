const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    age: { type: Number },
    phone: { type: String, required: true },
    isadmin: { type: Boolean, default: false },
    // ✅ Role field add ki
    role: {
        type: String,
        enum: ["entrepreneur", "investor"],
        default: "entrepreneur",
    },
});

UserSchema.pre("save", async function(next) {
    const user = this;
    if (!user.isModified("password")) {
        next();
    }
    try {
        const saltround = await bcrypt.genSalt(10);
        const hash_password = await bcrypt.hash(user.password, saltround);
        user.password = hash_password;
    } catch (error) {
        next(error);
    }
});

const jwt = require("jsonwebtoken");

UserSchema.methods.generateToken = async function () {
    try {
        return jwt.sign(
            {
                userid: this._id.toString(),
                email: this.email,
                isadmin: this.isadmin,
                role: this.role, // ✅ Role token mein bhi
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "30d" }
        );
    } catch (error) {
        console.error("JWT Error:", error);
    }
};

UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = new mongoose.model("User", UserSchema);
module.exports = User;