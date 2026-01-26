const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config({ path: "./config/.env" });

const app = express();

// Route imports
const eventRoutes = require("./routes/eventRoutes");
const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const auditRoutes = require("./routes/auditRoutes");
const registrationRoutes = require("./routes/registrationRoutes");

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/audit-logs", auditRoutes);
app.use("/api/registrations", registrationRoutes);

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
