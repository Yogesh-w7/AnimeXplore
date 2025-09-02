import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/api.css";
import Alert from "../components/flash"; // Import the Alert component

export default function Api() {
  const [topAnimeData, setTopAnimeData] = useState([]);
  const [filter, setFilter] = useState("favorite"); // Default filter
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [alertType, setAlertType] = useState(""); // 'success' or 'danger'
  const navigate = useNavigate();

  const fetchAnime = async (filterType, setState) => {
    try {
      const response = await fetch(`https://api.jikan.moe/v4/top/anime?filter=${filterType}`);
      if (!response.ok) {
        throw new Error(`Error fetching data: ${response.status}`);
      }
      const data = await response.json();
      setState(data.data);
      setAlertMessage("Anime list loaded successfully!"); // Success message
      setAlertType("success");
    } catch (error) {
      console.error(error);
      setAlertMessage(`Error: ${error.message}`); // Show error message
      setAlertType("danger");
    }
  };

  useEffect(() => {
    fetchAnime("bypopularity", setTopAnimeData);
  }, []);

  const handleAnimeClick = (anime) => {
    navigate(`/info`, { state: { id: anime.mal_id } }); // Pass the anime ID via state
  };

  return (
    <div>
      {/* Flash Alert */}
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage("")} // Close the alert when clicked
        />
      )}

      <div className="anime-section">
        <h2 className="heading">Top Anime</h2>
        <div className="anime-list">
          {topAnimeData.length > 0 ? (
            topAnimeData.map((anime) => (
              <div key={anime.mal_id} className="anime-item">
                <img
                  src={anime.images.jpg.image_url}
                  alt={anime.title}
                  onClick={() => handleAnimeClick(anime)}
                  style={{ cursor: "pointer" }}
                />
                <h5>{anime.title_english}</h5>
              </div>
            ))
          ) : (
            <p>Loading Top Anime...</p>
          )}
        </div>
      </div>
    </div>
  );
}
