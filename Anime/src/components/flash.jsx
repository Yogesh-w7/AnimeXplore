import React from "react";

function Alert({ message = "Something went wrong", type = "danger", onClose }) {
  return (
    <div
      className={`alert alert-${type} alert-dismissible fade show`}
      role="alert"
      style={{
        position: "fixed", // Fixed position
        top: "5rem", // Margin from top
        left: "50%", // Center horizontally
        transform: "translateX(-50%)", // Adjust to exactly center the alert
        zIndex: 1050, // Ensure it appears above other elements
        width: "auto", // Auto width to fit content
        minWidth: "200px", // Minimum width to avoid small alert boxes
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)", // Optional: shadow effect
      }}
    >
      <strong>{type === "success" ? "Success!" : "Error!"}</strong> {message}
      <button
        type="button"
        className="btn-close"
        data-bs-dismiss="alert"
        aria-label="Close"
        onClick={onClose}
      ></button>
    </div>
  );
}

export default Alert;
