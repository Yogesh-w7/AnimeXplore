import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";
import Alert from "../components/flash"; 

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("danger"); 
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/login",
        { username, password },
        { withCredentials: true }
      );

      if (response.data.token) {
        // ✅ Use localStorage to match AuthWrapper
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userId", response.data.userId);
      }

      setMessage(response.data.message || "Login successful.");
      setType("success");

      // ✅ Redirect to where user was trying to go, or /home
      const redirectPath = location.state?.from?.pathname || "/home";

      setTimeout(() => {
        navigate(redirectPath, { replace: true });
      }, 1000);

    } catch (error) {
      setMessage(error.response?.data?.message || "Login failed.");
      setType("danger");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="custom-page">
      {message && (
        <Alert
          message={message}
          type={type}
          onClose={() => setMessage("")}
        />
      )}

      <div className="form col-4">
        <h2 className="login">Login</h2>
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              name="username"
              id="username"
              type="text"
              value={username}
              className="form-control"
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <div className="invalid-feedback">Please enter a username</div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              name="password"
              id="password"
              type="password"
              value={password}
              className="form-control"
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />
            <div className="invalid-feedback">Please enter a password</div>
          </div>

          <button
            type="submit"
            className="btn btn-success col-6 offset-3"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}
