const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

// ✅ Create text index (no collation here)
faqSchema.index({ question: "text", answer: "text", tags: "text" });

// ✅ Ensure index creation
const FAQ = mongoose.model("FAQ", faqSchema);

// Build the index when model is first loaded
FAQ.createIndexes()
  .then(() => console.log("Text index created successfully"))
  .catch((err) => console.error("Error creating text index:", err));

module.exports = FAQ;
