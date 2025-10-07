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

// Create a text index for simple text search
faqSchema.index({ question: "text", answer: "text", tags: "text" });

module.exports = mongoose.model("FAQ", faqSchema);
