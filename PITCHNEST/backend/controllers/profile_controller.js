const User = require("../models/user");

const getProfile = async (req, res) => {
    try {
        // ✅ req.user already set hai middleware mein
        res.status(200).json(req.user);
    } catch (error) {
        console.error("Profile fetch error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

const updateProfile = async (req, res) => {
    try {
        const { username, age, phone, bio, location, website, linkedin, profilePicture } = req.body;

        const updatedData = {
            ...(username && { username }),
            ...(age && { age }),
            ...(phone && { phone }),
            ...(bio !== undefined && { bio }),
            ...(location !== undefined && { location }),
            ...(website !== undefined && { website }),
            ...(linkedin !== undefined && { linkedin }),
            ...(profilePicture !== undefined && { profilePicture }),
        };

        // ✅ req.user._id use karo
        const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $set: updatedData },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return res.status(404).json({ message: "User nahi mila" });
        }

        res.status(200).json({
            success: true,
            message: "Profile update ho gayi!",
            user: updatedUser
        });

    } catch (error) {
        console.error("Profile update error:", error);
        res.status(500).json({ message: "Server error" });
    }
};

module.exports = { getProfile, updateProfile };