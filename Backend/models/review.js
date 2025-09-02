const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  animeId: String,
  userId: String,
  review: String,
  rating: Number,
});

const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
