const Collaboration = require('../models/collaboration-model');

// ✅ POST - Request bhejo
const sendRequest = async (req, res) => {
    try {
        const { receiverId, message } = req.body;

        // Pehle check karo kya already request hai
        const existing = await Collaboration.findOne({
            sender: req.user._id,
            receiver: receiverId,
            status: 'pending'
        });

        if (existing) {
            return res.status(400).json({ message: 'Request already sent' });
        }

        const request = new Collaboration({
            sender: req.user._id,
            receiver: receiverId,
            message,
        });

        await request.save();
        res.status(201).json({ success: true, message: 'Request sent!', request });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ GET - Apni received requests dekho (entrepreneur ke liye)
const getReceivedRequests = async (req, res) => {
    try {
        const requests = await Collaboration.find({
            receiver: req.user._id
        }).populate('sender', 'username email role');

        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ GET - Apni sent requests dekho (investor ke liye)
const getSentRequests = async (req, res) => {
    try {
        const requests = await Collaboration.find({
            sender: req.user._id
        }).populate('receiver', 'username email role');

        res.status(200).json({ success: true, requests });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

// ✅ PUT - Request accept/reject karo
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;

        // ✅ Sirf _id se dhundho — receiver check hatao
        const request = await Collaboration.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );

        if (!request) {
            return res.status(404).json({ message: 'Request nahi mili' });
        }

        res.status(200).json({ success: true, message: `Request ${status}!`, request });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = { sendRequest, getReceivedRequests, getSentRequests, updateRequestStatus };