const Contact = require("../models/contact_model");

// ✅ Controller function for handling contact form
const Contactform = async (req, res) => {
  try {
    const response = req.body;

    // ✅ Save the contact form data to MongoDB
    await Contact.create(response);

    return res.status(201).json({
      status: 'success',
      msg: 'Message sent successfully',
    });
  } catch (error) {
    console.error("Contact submit error:", error);

    return res.status(500).json({
      status: 'fail',
      msg: 'Server error. Please try again later.',
    });
  }
};

// ✅ Export the function properly
module.exports = Contactform;
