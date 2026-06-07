const Meeting = require('../models/meeting-model');

// ✅ Schedule meeting
const scheduleMeeting = async (req, res) => {
  try {
    const { title, description, scheduledWith, date, time, duration } = req.body;
    const scheduledBy = req.user._id;

    // ✅ Conflict check
    const conflict = await Meeting.findOne({
      date,
      time,
      status: { $ne: 'cancelled' },
      $or: [
        { scheduledBy },
        { scheduledWith: scheduledBy }
      ]
    });

    if (conflict) {
      return res.status(400).json({ msg: 'You already have a meeting at this time' });
    }

    const meeting = new Meeting({
      title,
      description,
      scheduledBy,
      scheduledWith,
      date,
      time,
      duration,
    });

    await meeting.save();
    res.status(201).json({ msg: 'Meeting scheduled successfully', meeting });
  } catch (error) {
    console.error('Meeting error:', error);
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ✅ Get my meetings
const getMyMeetings = async (req, res) => {
  try {
    const userId = req.user._id;
    const meetings = await Meeting.find({
      $or: [{ scheduledBy: userId }, { scheduledWith: userId }]
    })
      .populate('scheduledBy', 'username email role')
      .populate('scheduledWith', 'username email role')
      .sort({ date: 1 });

    res.status(200).json({ meetings });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ✅ Accept
const acceptMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ msg: 'Meeting not found' });
    res.status(200).json({ msg: 'Meeting accepted', meeting });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ✅ Reject
const rejectMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: 'rejected' },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ msg: 'Meeting not found' });
    res.status(200).json({ msg: 'Meeting rejected', meeting });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ✅ Cancel
const cancelMeeting = async (req, res) => {
  try {
    const meeting = await Meeting.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!meeting) return res.status(404).json({ msg: 'Meeting not found' });
    res.status(200).json({ msg: 'Meeting cancelled', meeting });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = {
  scheduleMeeting,
  getMyMeetings,
  acceptMeeting,
  rejectMeeting,
  cancelMeeting,
};