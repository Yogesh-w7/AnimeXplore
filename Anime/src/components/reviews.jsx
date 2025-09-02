import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Rating from "@mui/material/Rating";
import "../styles/review.css";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import axios from "axios";
import Alert from "../components/flash"; // Import your Alert component

export default function Review({ animeId }) {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(2.5);
  const [username, setUsername] = useState(""); // State to store the username
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(""); // For managing alert message
  const [alertType, setAlertType] = useState(""); // 'success' or 'danger'
  const token = localStorage.getItem("token");

  // Fetch username
  useEffect(() => {
    if (!token) {
      return;
    }

    axios.get("http://localhost:5000/api/users/profile", {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then((response) => {
      setUsername(response.data.username); // Set the username
      setLoading(false); // Set loading to false once data is fetched
    })
    .catch(() => {
      setLoading(false); // Stop loading if an error occurs
    });
  }, [token]);

  // Fetch reviews for the anime
  useEffect(() => {
    if (animeId) {
      fetchReviews();
    }
  }, [animeId]);

  const fetchReviews = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${animeId}`);
      const data = await response.json();
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err);
      setAlertMessage("Error fetching reviews.");
      setAlertType("danger");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newReview || rating < 1 || rating > 5) return;

    const reviewData = { animeId, userId: username, review: newReview, rating };

    try {
      const response = await fetch("http://localhost:5000/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(reviewData),
      });

      if (response.ok) {
        setNewReview("");
        setRating(2.5);
        fetchReviews();
        setAlertMessage("Review submitted successfully!");
        setAlertType("success");
      } else {
        setAlertMessage("Failed to submit review.");
        setAlertType("danger");
      }
    } catch (err) {
      setAlertMessage("Error submitting review.");
      setAlertType("danger");
      console.error("Error submitting review:", err);
    }
  };

  // Delete review logic
  const handleDelete = async (reviewId) => {
    console.log("Attempting to delete review with ID:", reviewId);
  
    try {
      const response = await fetch(`http://localhost:5000/api/reviews/${reviewId}`, { 
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {
        setReviews(reviews.filter((review) => review._id !== reviewId));
        setAlertMessage("Review deleted successfully.");
        setAlertType("success");
        console.log("Review deleted successfully");
      } else {
        setAlertMessage("Failed to delete review.");
        setAlertType("danger");
        console.error("Failed to delete review, Response Code:", response.status);
      }
    } catch (err) {
      setAlertMessage("Error deleting review.");
      setAlertType("danger");
      console.error("Error deleting review:", err);
    }
  };
  
  // Conditional rendering for loading state
  if (loading) {
    return <p>Loading profile...</p>;
  }

  return (
    <Container className="review-container">
      {/* Flash Alert */}
      {alertMessage && (
        <Alert
          message={alertMessage}
          type={alertType}
          onClose={() => setAlertMessage("")} // Close the alert when clicked
        />
      )}

      <h2 className="text-center fw-bold mb-4 heading">Reviews & Ratings</h2>
  
      {/* Review Form */}
      <Row className="justify-content-center">
        <Col md={8} sm={10} xs={12}>
          <Form onSubmit={handleSubmit} className="review-form shadow-lg p-4 rounded">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Your Review:</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Write your review..."
                value={newReview}
                onChange={(e) => setNewReview(e.target.value)}
                required
              />
            </Form.Group>
  
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">Your Rating:</Form.Label>
              <div className="d-flex align-items-center gap-2">
                <Rating
                  name="user-rating"
                  value={rating}
                  precision={0.5}
                  onChange={(event, newValue) => setRating(newValue)}
                />
                <span className="fw-bold">{rating} Stars</span>
              </div>
            </Form.Group>
  
            <div className="text-center">
              <Button variant="danger" type="submit" className="fw-bold w-100">
                Submit Review
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
  
      {/* Display Reviews */}
      <Row className="mt-4 justify-content-center">
        {reviews.length === 0 ? (
          <p className="text-center text-muted">No reviews yet. Be the first to review!</p>
        ) : (
          reviews.map((review, index) => (
            <Col md={6} sm={10} xs={12} key={index} className="mb-3">
              <Card className="review-card shadow-sm">
                <Card.Body>
                  <div className="d-flex align-items-center gap-2">
                    <Rating name="read-only" value={review.rating} precision={0.5} readOnly />
                    <span className="fw-bold">⭐ {review.rating} Stars</span>
                  </div>
                  <Card.Text className="mt-2">{review.review}</Card.Text>
                  <b className="text-muted">@ {review.userId}</b>
  
                  {/* Delete button only for the review's owner */}
                  {review.userId === username && (
                    <div className="text-end">
                      <Button
                        variant="danger"
                        onClick={() => handleDelete(review._id)}
                        className="mt-2"
                        style={{
                          padding: "8px 14px",
                          fontSize: "0.9rem",
                          marginTop: "10px",
                          width: "auto", 
                        }}
                      >
                         Delete
                      </Button>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>
          ))
        )}
      </Row>
    </Container>
  );
}
