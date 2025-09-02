const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // Ensure Authorization header exists
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    // Extract token
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Malformed token" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Validate payload
    if (!decoded || !decoded.userId) {
      return res.status(403).json({ message: "Invalid token structure" });
    }

    // Attach user info to request for later use
    req.user = {
      id: decoded.userId,
      role: decoded.role || "user", // default role
      ...decoded
    };

    next();
  } catch (error) {
    console.error("Auth error:", error.message);

    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired. Please log in again." });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(403).json({ message: "Invalid token. Please log in again." });
    }

    res.status(500).json({ message: "Internal authentication error" });
  }
};
