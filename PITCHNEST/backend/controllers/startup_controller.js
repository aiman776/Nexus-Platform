const Startup = require('../models/startup-model');

const getAllStartups = async (req, res) => {
    try {
        const startups = await Startup.find().populate('user', 'username email');
        res.status(200).json({ success: true, startups });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const getMyStartup = async (req, res) => {
    try {
        const startup = await Startup.findOne({ user: req.user._id });
        if (!startup) return res.status(404).json({ message: 'Startup nahi mili' });
        res.status(200).json({ success: true, startup });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

const createStartup = async (req, res) => {
    try {
        const { name, startupName, industry, location, fundingNeeded, fundingAmount, stage, pitchSummary, tags } = req.body;

        const existing = await Startup.findOne({ user: req.user._id });
        if (existing) {
            return res.status(400).json({ message: 'Aapki startup already exist karti hai' });
        }

        const startup = new Startup({
            user: req.user._id,  // ✅ Fix
            name,
            initial: name?.charAt(0).toUpperCase(),
            startupName,
            industry,
            location,
            fundingNeeded,
            fundingAmount,
            stage,
            pitchSummary,
            tags: tags || [],
        });

        await startup.save();
        res.status(201).json({ success: true, message: 'Startup create ho gayi!', startup });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

const updateStartup = async (req, res) => {
    try {
        const { name, startupName, industry, location, fundingNeeded, fundingAmount, stage, pitchSummary, tags } = req.body;

        const updatedStartup = await Startup.findOneAndUpdate(
            { user: req.user._id },  // ✅ Fix
            {
                $set: {
                    ...(name && { name, initial: name.charAt(0).toUpperCase() }),
                    ...(startupName && { startupName }),
                    ...(industry && { industry }),
                    ...(location !== undefined && { location }),
                    ...(fundingNeeded !== undefined && { fundingNeeded }),
                    ...(fundingAmount !== undefined && { fundingAmount }),
                    ...(stage && { stage }),
                    ...(pitchSummary !== undefined && { pitchSummary }),
                    ...(tags && { tags }),
                }
            },
            { new: true }
        );

        if (!updatedStartup) return res.status(404).json({ message: 'Startup nahi mili' });

        res.status(200).json({ success: true, message: 'Startup update ho gayi!', startup: updatedStartup });

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { getAllStartups, getMyStartup, createStartup, updateStartup };