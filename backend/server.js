require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const faqRoutes = require("./routes/faqRoutes");

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error("Please set MONGO_URI in your .env file (see .env.example)");
  process.exit(1);
}

connectDB(MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

// Health
app.get("/", (req, res) => res.send("Insurance bot backend is running"));

// API
app.use("/api", faqRoutes);

// Global error handler (simple)
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal server error" });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
