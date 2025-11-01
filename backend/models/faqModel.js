const mongoose = require("mongoose");

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
  tags: [String],
  createdAt: { type: Date, default: Date.now },
});

//Do NOT use collation in schema options
//Create simple text index only
faqSchema.index({ question: "text", answer: "text", tags: "text" });

//Create model and build index manually
const FAQ = mongoose.model("FAQ", faqSchema);

// Ensure the index is built
FAQ.on("index", (err) => {
  if (err) console.error("Error creating text index:", err);
  else console.log("✅ Text index created successfully");
});

module.exports = FAQ;
