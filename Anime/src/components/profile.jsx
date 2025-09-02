import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Watchlist from "./watchlist";
import "../styles/profile.css";
import Alert from "../components/flash"; // Import the Alert component

const Profile = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(""); // Alert message state
  const [alertType, setAlertType] = useState(""); // 'success' or 'danger'
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    axios.get("http://localhost:5000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then((response) => {
        setUsername(response.data.username);
        setEmail(response.data.email);
        setLoading(false);
        setAlertMessage("Profile loaded successfully!");
        setAlertType("success");
      })
      .catch(() => {
        localStorage.removeItem("token");
        navigate("/login");
        setAlertMessage("Error loading profile, please log in again.");
        setAlertType("danger");
      });
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setAlertMessage("Logged out successfully.");
    setAlertType("success");
    navigate("/login");
  };

  if (loading) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="profile-container">
      {/* Flash Alert */}
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage("")} // Close the alert when clicked
        />
      )}

      <div className="profile-header">
        <img src="/default-avatar.png" alt="Profile" className="profile-pic" />
        <h2>{username}</h2>
        <p>{email}</p>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>

      <div className="watchlist-section">
        <h3>Your Watchlist</h3>
        <Watchlist userId={username} showImage={true} showTitle={true} showRemoveButton={true} />
      </div>
    </div>
  );
};

export default Profile;
