const express = require('express');
const router = express.Router();
const watchlistController = require('../controllers/watchlistController');
const auth = require('../middleware');

router.get('/', auth, watchlistController.getWatchlist);
router.post('/', auth, watchlistController.addToWatchlist);
router.delete('/:itemId', auth, watchlistController.removeFromWatchlist);

module.exports = router;