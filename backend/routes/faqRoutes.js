const express = require("express");
const router = express.Router();

// Example GET route
router.get("/faq", (req, res) => {
  res.json({ message: "FAQ route is working" });
});

module.exports = router;
