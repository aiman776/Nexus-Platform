const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  username: { type: String, required: true },
 email: { type: String, required: true }, // ✅ unique hata diya
  message: { type: String, required: true },
});

const Contact = mongoose.model("Contact", contactSchema);

module.exports = Contact;
