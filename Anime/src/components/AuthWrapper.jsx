import React, { useState, useEffect } from "react";
import { Outlet, Navigate, useLocation } from "react-router-dom";
import axios from "axios";

const AuthWrapper = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true; // prevent state update on unmounted component
    const token = localStorage.getItem("token");

    if (!token) {
      if (isMounted) {
        setIsAuthenticated(false);
        setLoading(false);
      }
      return;
    }

    axios
      .get("http://localhost:5000/auth", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (isMounted) {
          setIsAuthenticated(true);
          setLoading(false);
        }
      })
      .catch((err) => {
        console.error("Auth check failed:", err.response?.data || err.message);
        localStorage.removeItem("token");
        if (isMounted) {
          setIsAuthenticated(false);
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [location.pathname]); // recheck when route changes

  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h3>🔑 Checking authentication...</h3>
      </div>
    );
  }

  return isAuthenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
};

export default AuthWrapper;
