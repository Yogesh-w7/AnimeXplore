import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVolumeHigh, faVolumeMute } from "@fortawesome/free-solid-svg-icons";
import { NavLink, Link, useNavigate } from "react-router-dom";
import "../styles/navbar.css";
import Alert from "./flash";

export default function Navbar() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);
  const [alertMessage, setAlertMessage] = useState(""); // To store alert messages
  const [alertType, setAlertType] = useState(""); // 'success' or 'danger'
  const navigate = useNavigate();

  useEffect(() => {
    setAlertMessage(""); // Clear alert on initial render or page refresh
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    audioRef.current = new Audio("/Ru Ru Rururu-(PagalSongs.Com.IN).mp3");

    const handleAudioEnd = () => setIsPlaying(false);
    audioRef.current.addEventListener("ended", handleAudioEnd);

    return () => {
      audioRef.current.removeEventListener("ended", handleAudioEnd);
    };
  }, []);

  const handleAnimeClick = (anime) => {
    // Navigate to anime info page and pass success message
    navigate(`/info`, { 
      state: { 
        id: anime.mal_id, 
        successMessage: "Successfully loaded the anime details!" // Pass success message
      }
    });
  };

  const toggleAudio = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch((err) => console.error("Audio play error:", err));
    }
    setIsPlaying(!isPlaying);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setAlertMessage(""); // Clear previous alerts

    try {
      const response = await fetch(`https://api.jikan.moe/v4/anime?q=${searchQuery}&limit=5`);

      if (!response.ok) {
        throw new Error(`Failed to fetch anime: ${response.status}`);
      }
      const data = await response.json();
      setSearchResults(data.data);

      // Check if no results were returned and show danger alert
      if (data.data.length === 0) {
        setAlertMessage("No anime found for your search query.");
        setAlertType("danger");
      }
    } catch (err) {
      setError(err.message);
      setSearchResults([]); // Clear previous search results
      setAlertMessage(`Error: ${err.message}`); // Show the error message
      setAlertType("danger"); // Danger alert type
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  const handleNavToggle = () => {
    setIsNavCollapsed((prevState) => !prevState);
    document.body.classList.toggle("nav-open", !isNavCollapsed);
  };

  return (
    <nav className="navbar sticky-top navbar-expand-lg navbar-dark mt-0 p-0">
      {/* Flash Alert Component */}
      {alertMessage && <Alert message={alertMessage} type={alertType} onClose={() => setAlertMessage("")} />}

      <div className="container-fluid">
        <a className="navbar-brand" href="/">
          <img src="https://res.cloudinary.com/dyelgucps/image/upload/v1756806470/nRUTO_logo_ucwehz.png" alt="Logo" />
        </a>
        <button className="navbar-toggler" type="button" onClick={handleNavToggle} aria-controls="navbarNav" aria-expanded={!isNavCollapsed}>
          <span className="navbar-toggler-icon" style={{ color: "white" }}></span>
        </button>

        <div className={`navbar-collapse ${isNavCollapsed ? "collapse" : "collapse show"}`} id="navbarNav">
          <ul className="navbar-nav">
            <li className="nav-item">
              <NavLink to="/home" className={({ isActive }) => (isActive ? "yellow" : "")}>
                Home
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/explore" className={({ isActive }) => (isActive ? "yellow" : "")}>
                Explore
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/news" className={({ isActive }) => (isActive ? "yellow" : "")}>
                News
              </NavLink>
            </li>

            {!isAuthenticated ? (
              <li className="nav-item">
                <Link className="btn btn-success" to="/singup">Signup</Link>
              </li>
            ) : (
              <li className="nav-item">
                <NavLink to="/profile" className={({ isActive }) => (isActive ? "yellow" : "")}>
                  Profile
                </NavLink>
              </li>
            )}
          </ul>

          {/* Search Form */}
          <form className="d-flex position-relative w-100" onSubmit={handleSearch}>
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ color: "white" }}
            />
            <button className="btn btn-outline-danger" type="submit">Search</button>

            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="dropdown-menu show w-100 position-absolute" style={{ top: "100%", left: 0 }}>
                {loading && <p className="dropdown-item text-center">Loading...</p>}
                {error && <p className="dropdown-item text-danger">Error: {error}</p>}
                <ul className="list-unstyled mb-0">
                  {searchResults.map((anime) => (
                    <li key={anime.mal_id} className="dropdown-item d-flex align-items-center" onClick={() => handleAnimeClick(anime)} style={{ cursor: "pointer" }}>
                      <img src={anime.images.jpg.image_url} alt={anime.title_english || anime.title} style={{ width: "50px", height: "50px", borderRadius: "5px", marginRight: "10px" }} />
                      <div>
                        <strong>{anime.title_english?.substring(0, 27) || anime.title.substring(0, 27)}</strong>
                        <p className="mb-0 text-truncate" style={{ width: "10rem" }}>
                          {anime.synopsis ? anime.synopsis.substring(0, 60) + "..." : "No description available."}
                        </p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </form>
        </div>
      </div>
    </nav>
  );
}
