const FAQ = require("../models/faqModel");

/**
 * askQuestion
 * - tries a Mongo $text search for the incoming question
 * - if none found, falls back to a case-insensitive regex search
 * - returns best match or a 'not found' fallback
 */
exports.askQuestion = async (req, res) => {
  try {
    const { question } = req.body;
    if (!question || !question.trim()) {
      return res.status(400).json({ error: "Question text is required." });
    }

    // 1) Try text search (requires the text index defined in model)
    const textResults = await FAQ.find(
      { $text: { $search: question } },
      { score: { $meta: "textScore" } }
    )
      .sort({ score: { $meta: "textScore" } })
      .limit(3)
      .lean();

    if (textResults && textResults.length) {
      // Return the top result with a confidence indicator
      return res.json({
        source: "db_text",
        confidence: "high",
        match: textResults[0]
      });
    }

    // 2) Fallback: try simple regex matching on question field for partial matches
    const regex = new RegExp(question.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "i");
    const regexResult = await FAQ.findOne({ question: regex }).lean();

    if (regexResult) {
      return res.json({
        source: "db_regex",
        confidence: "medium",
        match: regexResult
      });
    }

    // 3) No match found
    return res.json({
      source: "none",
      confidence: "low",
      match: null,
      message: "Sorry, I don't have that information yet."
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

/**
 * simple admin endpoint to insert seed FAQ items (for initial testing)
 * - exposed for convenience. In production protect this with auth.
 */
exports.addFAQ = async (req, res) => {
  try {
    const { question, answer, tags } = req.body;
    if (!question || !answer) {
      return res.status(400).json({ error: "question and answer required" });
    }
    const doc = await FAQ.create({ question, answer, tags: tags || [] });
    return res.status(201).json(doc);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};
