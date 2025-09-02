import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Api from "../components/api";
import Alert from "../components/flash"; // Assuming you have an Alert component

export default function Explore() {
  const navigate = useNavigate();

  const [popularAnimeData, setPopularAnimeData] = useState([]);
  const [upcomingAnimeData, setUpcomingAnimeData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState(""); // State for error message

  const fetchAnime = async (filterType, setState) => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/top/anime?filter=${filterType}`);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      setState(data.data || []);
    } catch (error) {
      setErrorMessage("Failed to load anime data. Please try again later.");
      console.error(error); // Log the error for debugging
    }
  };

  useEffect(() => {
    const fetchAllAnime = async () => {
      setLoading(true);
      await Promise.all([
        fetchAnime("bypopularity", setPopularAnimeData),
        fetchAnime("upcoming", setUpcomingAnimeData),
      ]);
      setLoading(false);
    };
    fetchAllAnime();
  }, []);

  const handleAnimeClick = (anime) => {
    navigate(`/info`, { state: { id: anime.mal_id } }); // Pass the anime ID via state
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <Api />
        <div>Loading...</div> {/* Loading indicator */}
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <Api />

      {/* Show the error alert if there's an error message */}
      {errorMessage && (
        <div className="alert alert-danger alert-dismissible fade show" role="alert">
          {errorMessage}
          <button
            type="button"
            className="btn-close"
            data-bs-dismiss="alert"
            aria-label="Close"
            onClick={() => setErrorMessage("")} // Clear the error message when closed
          ></button>
        </div>
      )}

      <div className="anime-section">
        <h2 className="heading">Upcoming</h2>
        <div className="anime-list">
          {upcomingAnimeData.map((anime) => (
            <div key={anime.mal_id} className="anime-item">
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                onClick={() => handleAnimeClick(anime)}
                style={{ cursor: "pointer" }}
              />
              <h4>{anime.title_english}</h4>
            </div>
          ))}
        </div>
      </div>

      <div className="anime-section">
        <h2 className="heading">Popular</h2>
        <div className="anime-list">
          {popularAnimeData.map((anime) => (
            <div key={anime.mal_id} className="anime-item">
              <img
                src={anime.images.jpg.image_url}
                alt={anime.title}
                onClick={() => handleAnimeClick(anime)}
                style={{ cursor: "pointer" }}
              />
              <h5>{anime.title_english}</h5>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
