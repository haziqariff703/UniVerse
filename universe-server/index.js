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
const venueRoutes = require("./routes/venueRoutes");
const speakerRoutes = require("./routes/speakerRoutes");
const communityRoutes = require("./routes/communityRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const helmet = require("helmet");
const hpp = require("hpp");
const rateLimit = require("express-rate-limit");


// Middleware
app.use(cors());
app.use(express.json());

// Security Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } })); // Allow images to load
app.use(hpp()); // Prevent HTTP Parameter Pollution

// Rate Limiting (100 requests per 10 mins)
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, 
  max: 100,
  message: "Too many requests from this IP, please try again later."
});
app.use("/api", limiter); // Apply to all API routes

app.use("/public", express.static("public"));

// API Routes
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/audit-logs", auditRoutes);
app.use("/api/audit", auditRoutes); // Organizer access to activity logs
app.use("/api/registrations", registrationRoutes);
app.use("/api/venues", venueRoutes);
app.use("/api/speakers", speakerRoutes);
app.use("/api/communities", communityRoutes);
app.use("/api/proposals", require("./routes/clubProposalRoutes"));
app.use("/api/crew", require("./routes/crewRoutes"));
app.use("/api/categories", require("./routes/categoryRoutes"));
app.use("/api/notifications", notificationRoutes);
app.use("/api/public", require("./routes/publicRoutes"));

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Global Error:", err.stack);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

app.get("/", (req, res) => {
  res.send("UniVerse Backend is Online and Optimized!");
});

// Async Server Startup - Wait for DB Connection First
const startServer = async () => {
  try {
    // 1. Connect to Database First (Use 127.0.0.1 for local stability)
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/UniVerse",
    );
    console.log(`UniVerse Database Connected!  [DB: ${mongoose.connection.name}]`);

    // 2. ONLY THEN Start the Server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Database Connection Failed!", error.message);
    process.exit(1); // Stop the process if we can't connect
  }
};

startServer();
