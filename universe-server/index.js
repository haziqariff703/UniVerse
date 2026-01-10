const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });

const app = express();
const eventRoutes = require("./routes/eventRoutes");

// Middleware
app.use(cors());
app.use(express.json()); // Allows the server to read JSON
app.use("/api/events", eventRoutes);

// Database Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("UniVerse Database Connected! ✅"))
  .catch((err) => console.log("Database Connection Error: ❌", err));

// Basic Route for Testing
app.get("/", (req, res) => {
  res.send("UniVerse Backend is Online and Optimized! 🚀");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
