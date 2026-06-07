const Deal = require('../models/deal-model');

// ✅ Get my deals
const getMyDeals = async (req, res) => {
  try {
    const deals = await Deal.find({ investor: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ deals });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ✅ Add deal
const addDeal = async (req, res) => {
  try {
    const { startup, amount, equity, stage, status } = req.body;
    const deal = new Deal({
      investor: req.user._id,
      startup,
      amount,
      equity,
      stage,
      status,
    });
    await deal.save();
    res.status(201).json({ msg: 'Deal added successfully', deal });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ✅ Update deal status
const updateDealStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const deal = await Deal.findByIdAndUpdate(id, { status }, { new: true });
    if (!deal) return res.status(404).json({ msg: 'Deal not found' });
    res.status(200).json({ msg: 'Deal updated', deal });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

// ✅ Delete deal
const deleteDeal = async (req, res) => {
  try {
    const deal = await Deal.findByIdAndDelete(req.params.id);
    if (!deal) return res.status(404).json({ msg: 'Deal not found' });
    res.status(200).json({ msg: 'Deal deleted' });
  } catch (error) {
    res.status(500).json({ msg: 'Internal server error' });
  }
};

module.exports = { getMyDeals, addDeal, updateDealStatus, deleteDeal };