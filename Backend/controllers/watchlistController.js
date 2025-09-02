const Watchlist = require('../models/watchlist');

const getWatchlist = async (req, res) => {
  try {
    const userId = req.userData.userId;
    const watchlistItems = await Watchlist.find({ userId });
    res.status(200).json(watchlistItems);
  } catch (error) {
    console.error("Error fetching watchlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const addToWatchlist = async (req, res) => {
  try {
    const userId = req.userData.userId; // Get from token
    const { itemId, itemName, itemImage, itemType } = req.body;

    // Check for existing item
    const existingItem = await Watchlist.findOne({ userId, itemId });
    if (existingItem) {
      return res.status(409).json({ message: "Item already in watchlist" });
    }

    const newItem = new Watchlist({
      userId,
      itemId,
      itemName,
      itemImage,
      itemType,
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error adding to watchlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

const removeFromWatchlist = async (req, res) => {
  try {
    const { itemId } = req.params;
    const userId = req.userData.userId;
    const result = await Watchlist.findOneAndDelete({ userId, itemId });
    
    if (!result) {
      return res.status(404).json({ message: "Item not found in watchlist" });
    }
    
    res.status(200).json({ message: "Item removed from watchlist" });
  } catch (error) {
    console.error("Error removing from watchlist:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getWatchlist, addToWatchlist, removeFromWatchlist };