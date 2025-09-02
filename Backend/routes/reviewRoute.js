const express = require("express");
const router = express.Router();
const Review = require("../models/review");

// Get reviews for a specific anime by animeId
router.get("/:animeId", async (req, res) => {
  try {
    const reviews = await Review.find({ animeId: req.params.animeId });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Post a new review
router.post("/", async (req, res) => {
  try {
    const { animeId, userId, review, rating } = req.body;
    const newReview = new Review({ animeId, userId, review, rating });
    await newReview.save();
    res.json({ message: "Review added successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:reviewId", async (req, res) => {
  const { reviewId } = req.params;
  console.log("Received request to delete review:", reviewId);

  try {
      const review = await Review.findById(reviewId);
      console.log("Fetched review from DB:", review);

      if (!review) {
          console.log("Review not found in database.");
          return res.status(404).json({ message: "Review not found" });
      }

      await Review.findByIdAndDelete(reviewId);
      console.log("Review deleted successfully");
      res.status(200).json({ message: "Review deleted successfully" });
  } catch (error) {
      console.error("Error deleting review:", error);
      res.status(500).json({ message: "Server error" });
  }
});
module.exports = router;
