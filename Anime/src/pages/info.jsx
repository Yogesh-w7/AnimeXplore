import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "../components/navbar";
import Watchlist from "../components/watchlist";
import "../styles/info.css";
import Review from "../components/reviews";
import axios from "axios";
import Alert from "../components/flash"; // Import the Alert component

export default function AnimeDetails() {
  const { state } = useLocation(); // Get state from location
  const navigate = useNavigate();
  const [animeDetails, setAnimeDetails] = useState(null);
  const [error, setError] = useState(null);
  const [username, setUsername] = useState(""); // State to hold the username
  const [loading, setLoading] = useState(true); // Loading state
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [alertType, setAlertType] = useState(""); // 'success' or 'danger'

  const token = localStorage.getItem("token");

  useEffect(() => {
    // Fetch the user profile only if the token exists
    if (token) {
      axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then((response) => {
          setUsername(response.data.username); // Set the username from the API
          setLoading(false); // Set loading to false after fetching user data
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
          setLoading(false);
          setAlertMessage("Error fetching user profile."); // Show error alert
          setAlertType("danger");
        });
    } else {
      setLoading(false); // If no token is available, stop loading
    }
  }, [token]);

  useEffect(() => {
    if (!state || !state.id) {
      setError("No anime ID provided.");
      setAlertMessage("No anime ID provided.");
      setAlertType("danger");
      return;
    }

    // If there is a success message passed from the Navbar
    if (state.successMessage) {
      setAlertMessage(state.successMessage);
      setAlertType("success");
    }

    // Fetch anime details using the Jikan API
    const fetchAnimeDetails = async () => {
      try {
        const response = await fetch(`https://api.jikan.moe/v4/anime/${state.id}/full`);
        if (!response.ok) {
          throw new Error(`Failed to fetch anime details: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched Anime Details:", data); // Debugging log
        setAnimeDetails(data.data); // Update anime details state
      } catch (err) {
        setError(err.message); // Handle fetch errors
        setAlertMessage(`Error: ${err.message}`);
        setAlertType("danger");
      }
    };

    fetchAnimeDetails();
  }, [state]);

  // Handle error state
  if (error) {
    return (
      <div>
        <p>Error: {error}</p>
        <button onClick={() => navigate(-1)}>Back</button>
      </div>
    );
  }

  // Handle loading state for anime details and user data
  if (loading || !animeDetails) {
    return <p>Loading...</p>;
  }

  // Render anime details
  const {
    title,
    synopsis,
    images,
    airing,
    genres,
    duration,
    rating,
    status,
    episodes,
    trailer,
  } = animeDetails;

  return (
    <div>
      <Navbar />
      
      {/* Flash Alert Component */}
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage("")} // Close the alert when clicked
        />
      )}

      <h2 className="heading">Anime Details</h2>
      <button className="back" onClick={() => navigate(-1)}>Back</button>
      <div style={{ display: "flex", gap: "20px", marginTop: "20px", padding: "2rem" }}>
        {/* Anime Image */}
        <div>
          {images && images.jpg && images.jpg.image_url ? (
            <img
              src={images.jpg.image_url}
              alt={title}
              style={{
                aspectRatio: "9/16",
                maxWidth: "13rem",
                height: "20rem",
                borderRadius: "10px",
                marginTop: "0rem",
              }}
            />
          ) : (
            <p>No image available</p>
          )}
        </div>
        {/* Anime Information */}
        <div>
          <h2 className="heading-info">{animeDetails.title_english || animeDetails.title}</h2>
          <p>
            <strong>🌟Description:</strong> {synopsis || "No description available."}
          </p>
          <p>
            <strong>🌟Airing Status:</strong> {airing ? "Currently Airing" : "Not Airing"}
          </p>
          <p>
            <strong>🌟Genres:</strong>{" "}
            {genres && genres.length > 0
              ? genres.map((genre) => genre.name).join(", ")
              : "N/A"}
          </p>
          <p>
            <strong>🌟Duration:</strong> {duration || "N/A"}
          </p>
          <p>
            <strong>🌟Rating:</strong> {rating || "N/A"}
          </p>
          <p>
            <strong>🌟Status:</strong> {status || "N/A"}
          </p>
          <p>
            <strong>🌟Episodes:</strong> {episodes || "N/A"}
          </p>

          {/* Watchlist Button */}
          <div>
            <Watchlist
              userId={username} // Pass the username
              animeId={state.id}
              animeTitle={title}
              animeImage={images.jpg.image_url}
              showImage={false}
              showTitle={false}
            />
          </div>
        </div>
      </div>

      {/* Anime Trailer */}
      <div style={{ marginTop: "3rem" }}>
        <h2 className="heading heading-t">Trailer</h2>
        {trailer && trailer.embed_url ? (
          <iframe
            className="trailer"
            width="900"
            height="500"
            src={trailer.embed_url}
            title={`${title} Trailer`}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <p>No trailer available for this anime.</p>
        )}
      </div>

      {/* Reviews Section */}
      <Review animeId={state.id} userId={username} />
    </div>
  );
}
