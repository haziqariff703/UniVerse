const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config({ path: './config/.env' });

const app = express();

// Import Routes
const eventRoutes = require('./routes/eventRoutes');
const authRoutes = require('./routes/authRoutes');
const registrationRoutes = require('./routes/registrationRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/registrations', registrationRoutes);

// Database Connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("UniVerse Database Connected! ✅"))
  .catch(err => console.log("Database Connection Error: ❌", err));

// Basic Route for Testing
app.get('/', (req, res) => {
  res.send("UniVerse Backend is Online and Optimized! 🚀");
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Global Error:', err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));