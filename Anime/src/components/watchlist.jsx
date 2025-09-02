import React, { useState, useEffect } from "react";
import axios from "axios";

const Watchlist = ({
  animeId,
  animeTitle,
  animeImage,
  showImage = false,
  showTitle = true,
  showRemoveButton = false // New prop
}) => {
  const [watchlistItems, setWatchlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  // Get token and user ID from localStorage
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  useEffect(() => {
    if (!token) {
      setError("Authentication required");
      setLoading(false);
      return;
    }

    const fetchWatchlist = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/watchlist', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setWatchlistItems(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        handleAuthError(error);
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [token]); // Dependency on token instead of userId

  const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      setError("Session expired. Please log in again.");
    } else {
      setError(error.response?.data?.message || "An error occurred");
    }
  };

  const addToWatchlist = async () => {
    if (!animeId || !animeTitle || !animeImage) {
      setError("Missing required anime information");
      return;
    }

    setProcessing(true);
    try {
      const response = await axios.post(
        'http://localhost:5000/api/watchlist',
        {
          itemId: animeId,
          itemName: animeTitle,
          itemImage: animeImage,
          itemType: "anime"
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Optimistic update instead of refetching
      setWatchlistItems(prev => [...prev, response.data]);
    } catch (error) {
      console.error("Error adding to watchlist:", error);
      handleAuthError(error);
    } finally {
      setProcessing(false);
    }
  };

  const isItemInWatchlist = watchlistItems.some(item => item.itemId === animeId);

  if (!token) {
    return <p>Please log in to access your watchlist</p>;
  }

  const handleRemoveFromWatchlist = async (itemId) => {
    setProcessing(true);
    try {
      await axios.delete(`http://localhost:5000/api/watchlist/${itemId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      // Remove item from state
      setWatchlistItems(prev => prev.filter(item => item.itemId !== itemId));
    } catch (error) {
      console.error("Error removing from watchlist:", error);
      handleAuthError(error);
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="watchlist-container">
      {loading ? (
        <p>Loading watchlist...</p>
      ) : (
        <div>
          {/* Add to Watchlist Button */}
          {animeId && (
            <button
              onClick={addToWatchlist}
              style={{ color: "white", backgroundColor: "#ff2770", padding: "10px", borderRadius: "5px", marginTop: "3rem" }}
              disabled={processing || isItemInWatchlist}
            >
              {processing ? 'Adding...' : isItemInWatchlist ? 'In Watchlist' : 'Add to Watchlist'}
            </button>
          )}

          {error && <p className="error-message">{error}</p>}

          {/* Display Watchlist Items - Hide on Anime Info Page */}
          {!animeId && watchlistItems.length > 0 && (
            <ul className="watchlist-items" style={{ listStyleType: "none !important"}}>
              {watchlistItems.map((item) => (
                <li key={item._id} className="watchlist-item" style={{ listStyleType: "none !important" }}>
                  {showImage && (
                    <img
                      src={item.itemImage}
                      alt={item.itemName}
                      className="anime-image"
                      onError={(e) => {
                        e.target.src = 'fallback-image-url.jpg';
                      }}
                    />
                  )}
                  {showTitle && <span className="anime-title">{item.itemName}</span>}
                  {showRemoveButton && (
                    <button
                      onClick={() => handleRemoveFromWatchlist(item.itemId)}
                      disabled={processing}
                      className="remove-btn"
                  
                    >
                      {processing ? 'Removing...' : 'Remove'}
                    </button>
                  )}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
};

export default Watchlist;
