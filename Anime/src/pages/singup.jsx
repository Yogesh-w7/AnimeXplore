import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";
import axios from "axios";
import Alert from "../components/flash";

export default function Signup() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("danger");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const validateInputs = () => {
    if (!username || !email || !password) {
      return "Please fill all fields.";
    }
    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }
    // Basic password strength (at least 6 chars, one number)
    if (password.length < 6 || !/\d/.test(password)) {
      return "Password must be at least 6 characters and contain a number.";
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateInputs();
    if (validationError) {
      setMessage(validationError);
      setType("danger");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/users/signup",
        { username, email, password },
        { withCredentials: true } // ✅ allow HttpOnly cookies if backend sets them
      );

      // If backend returns token in response (not ideal, but fallback)
      if (response.data.token) {
        sessionStorage.setItem("token", response.data.token);
        sessionStorage.setItem("userId", response.data.userId);
      }

      setMessage(response.data.message || "Signup successful");
      setType("success");

      // ✅ Delay navigation so user sees success alert
      setTimeout(() => navigate("/home"), 1000);

    } catch (error) {
      console.error("Signup error:", error.response?.data);

      let errorMsg = "An error occurred. Please try again.";
      if (error.response?.status === 400) {
        errorMsg = error.response.data.errors?.[0]?.msg || "Validation failed";
      } else if (error.response?.status === 401 || error.response?.status === 409) {
        errorMsg = error.response.data.message || "User already exists or unauthorized.";
      }

      setMessage(errorMsg);
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
        <h2 className="login">Sign Up</h2>
        <form onSubmit={handleSubmit} className="needs-validation" noValidate>
          <div className="mb-3">
            <label htmlFor="username" className="form-label">Username</label>
            <input
              id="username"
              type="text"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
            <div className="invalid-feedback">Please enter a username</div>
          </div>

          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />
            <div className="invalid-feedback">Please enter a valid email</div>
          </div>

          <div className="mb-3">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
              required
            />
            <div className="invalid-feedback">Please enter a password</div>
          </div>

          <button
            type="submit"
            className="btn btn-success col-6 offset-3"
            disabled={loading}
          >
            {loading ? "Submitting..." : "Signup"}
          </button>
        </form>
      </div>
    </div>
  );
}
