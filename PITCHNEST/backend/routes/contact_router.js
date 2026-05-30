const express = require("express");
const router = express.Router();

// ✅ Import the controller function correctly
const Contactform = require('../controllers/contact_controller');

// ✅ Route setup: use the function directly (it's not an object)
router.post("/contact", Contactform);

// ✅ Export the router (not the controller)
module.exports = router;
