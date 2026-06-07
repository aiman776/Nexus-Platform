const mongoose = require('mongoose');

const dealSchema = new mongoose.Schema({
  investor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  startup: {
    name: { type: String, required: true },
    industry: { type: String, required: true },
  },
  amount: { type: String, required: true },
  equity: { type: String, required: true },
  stage: { type: String, required: true },
  status: {
    type: String,
    enum: ['Due Diligence', 'Term Sheet', 'Negotiation', 'Closed', 'Passed'],
    default: 'Due Diligence'
  },
}, { timestamps: true });

const Deal = mongoose.model('Deal', dealSchema);
module.exports = Deal;