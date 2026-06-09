const Investor = require('../models/investor-model');

// ✅ GET - Saare investors
const getAllInvestors = async (req, res) => {
  try {
    const investors = await Investor.find().populate('user', 'username email');
    res.status(200).json({ success: true, investors });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET - Investor by MongoDB _id
const getInvestorById = async (req, res) => {
  try {
    const investor = await Investor.findById(req.params.id).populate('user', 'username email');
    if (!investor) return res.status(404).json({ message: 'Investor nahi mila' });
    res.status(200).json({ success: true, investor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET - User ID se investor profile fetch karo (navbar avatar click)
const getInvestorByUserId = async (req, res) => {
  try {
    const investor = await Investor.findOne({ user: req.params.userId })
      .populate('user', 'username email');
    if (!investor) return res.status(404).json({ message: 'Investor profile nahi mili' });
    res.status(200).json({ success: true, investor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ GET - Apna investor profile
const getMyInvestorProfile = async (req, res) => {
  try {
    const investor = await Investor.findOne({ user: req.user._id });
    if (!investor) return res.status(404).json({ message: 'Investor profile nahi mili' });
    res.status(200).json({ success: true, investor });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ POST - Investor profile create karo
const createInvestorProfile = async (req, res) => {
  try {
    const {
      name, company, location, bio,
      investmentStage, investmentInterests,
      minimumInvestment, maximumInvestment,
      totalInvestments, portfolioCompanies
    } = req.body;

    const existing = await Investor.findOne({ user: req.user._id });
    if (existing) {
      return res.status(400).json({ message: 'Investor profile already exist karti hai' });
    }

    const investor = new Investor({
      user: req.user._id,
      name,
      company,
      location,
      bio,
      investmentStage: investmentStage || [],
      investmentInterests: investmentInterests || [],
      minimumInvestment,
      maximumInvestment,
      totalInvestments: totalInvestments || 0,
      portfolioCompanies: portfolioCompanies || [],
    });

    await investor.save();
    res.status(201).json({ success: true, message: 'Investor profile create ho gayi!', investor });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ PUT - Investor profile update karo
const updateInvestorProfile = async (req, res) => {
  try {
    const {
      name, company, location, bio,
      investmentStage, investmentInterests,
      minimumInvestment, maximumInvestment,
      totalInvestments, portfolioCompanies
    } = req.body;

    const updatedInvestor = await Investor.findOneAndUpdate(
      { user: req.user._id },
      {
        $set: {
          ...(name && { name }),
          ...(company !== undefined && { company }),
          ...(location !== undefined && { location }),
          ...(bio !== undefined && { bio }),
          ...(investmentStage && { investmentStage }),
          ...(investmentInterests && { investmentInterests }),
          ...(minimumInvestment !== undefined && { minimumInvestment }),
          ...(maximumInvestment !== undefined && { maximumInvestment }),
          ...(totalInvestments !== undefined && { totalInvestments }),
          ...(portfolioCompanies && { portfolioCompanies }),
        }
      },
      { new: true, upsert: true } // ✅ upsert - nahi hai to create karo
    );

    res.status(200).json({
      success: true,
      message: 'Investor profile update ho gayi!',
      investor: updatedInvestor
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllInvestors,
  getInvestorById,
  getInvestorByUserId, // ✅ naya add kiya
  getMyInvestorProfile,
  createInvestorProfile,
  updateInvestorProfile,
};