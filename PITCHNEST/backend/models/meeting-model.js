const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  scheduledBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  scheduledWith: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  duration: { type: Number, default: 30 },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'cancelled'],
    default: 'pending'
  },
}, { timestamps: true });

const Meeting = mongoose.model('Meeting', meetingSchema);
module.exports = Meeting;