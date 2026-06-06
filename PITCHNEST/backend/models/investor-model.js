const mongoose = require('mongoose');

const InvestorSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    name: { type: String, required: true },
    company: { type: String, default: '' },
    location: { type: String, default: '' },
    bio: { type: String, default: '' },
    investmentStage: [{ type: String }],
    investmentInterests: [{ type: String }],
    minimumInvestment: { type: String, default: '' },
    maximumInvestment: { type: String, default: '' },
    totalInvestments: { type: Number, default: 0 },
    portfolioCompanies: [{ type: String }],
}, { timestamps: true });

const Investor = mongoose.model('Investor', InvestorSchema);
module.exports = Investor;