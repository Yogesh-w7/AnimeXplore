const mongoose = require('mongoose');

const watchlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  itemId: { type: String, required: true },
  itemName: { type: String, required: true },
  itemImage: { type: String, required: true },
  itemType: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Watchlist', watchlistSchema);
