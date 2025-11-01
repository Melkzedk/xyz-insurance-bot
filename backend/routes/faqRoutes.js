const express = require("express");
const router = express.Router();
const { askQuestion, addFAQ } = require("../controllers/faqController");

// Ask question (the chatbot uses this)
router.post("/ask", askQuestion);

// Optional: Add FAQ manually for testing
router.post("/add", addFAQ);

// Test route
router.get("/faq", (req, res) => {
  res.json({ message: "FAQ route is working" });
});

module.exports = router;
