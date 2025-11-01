const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    answer: { type: String, required: true },
    tags: [String],
    createdAt: { type: Date, default: Date.now }
  },
  { collation: { locale: "en", strength: 2 } }
);

faqSchema.index({ question: "text", answer: "text", tags: "text" });

// Ensure index creation
const FAQ = mongoose.model("FAQ", faqSchema);
FAQ.createIndexes(); // ✅ build the text index

module.exports = FAQ;
