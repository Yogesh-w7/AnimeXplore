require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const userRoute = require("./routes/userRoute");
const watchlistRoute = require("./routes/watchlistRoute");
const reviewRouter = require("./routes/reviewRoute");
const authMiddleware = require("./middleware");

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(
  cors({
    origin: "http://localhost:5173", // frontend
    credentials: true,
  })
);

// MongoDB Connection
const dbUrl = process.env.MONGO_ATLAS_URL;

mongoose
  .connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to MongoDB Atlas"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// Routes
app.use("/api/users", userRoute);
app.use("/api/reviews", reviewRouter);
app.use("/api/watchlist", watchlistRoute);

app.get("/auth", authMiddleware, (req, res) => {
  res.status(200).json({ message: "Token is valid", userData: req.userData });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
