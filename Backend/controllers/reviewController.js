// In your reviewController.js or routes file
const express = require('express');
const router = express.Router();
const Review = require('../models/review');

router.post("/", async (req, res) => {
  const { animeId, userId, review, rating } = req.body;
  
  try {
    if (!animeId || !userId || !review || !rating) {
      return res.status(400).json({ error: "All fields are required." });
    }

    const newReview = new Review({ animeId, userId, review, rating });
    await newReview.save();
    res.status(201).json({ message: "Review added successfully!" });
  } catch (err) {
    console.error("Error saving review:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});





  
  

module.exports = router;
