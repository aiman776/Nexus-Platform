const mongoose = require('mongoose');

const StartupSchema = new mongoose.Schema({
    // Entrepreneur ka reference
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true }, // Entrepreneur ka naam
    initial: { type: String },              // Avatar letter
    startupName: { type: String, required: true },
    industry: {
        type: String,
        enum: ['FinTech', 'CleanTech', 'HealthTech', 'AgTech', 'EdTech', 'Other'],
        required: true,
    },
    location: { type: String, default: '' },
    fundingNeeded: { type: String, default: '' },  // e.g. "$1.5M"
    fundingAmount: { type: Number, default: 0 },   // e.g. 1500
    stage: {
        type: String,
        enum: ['Pre-seed', 'Seed', 'Series A', 'Series B'],
        default: 'Pre-seed',
    },
    pitchSummary: { type: String, default: '' },
    tags: [{ type: String }],
}, { timestamps: true });

const Startup = mongoose.model('Startup', StartupSchema);
module.exports = Startup;