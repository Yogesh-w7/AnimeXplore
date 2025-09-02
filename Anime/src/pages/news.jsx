import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import "../App.css";
import Alert from "../components/flash"; // Import the Alert component

export default function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(""); // State for alert message
  const [alertType, setAlertType] = useState(""); // 'success' or 'danger'

  const newsKey = import.meta.env.VITE_NEWS_KEY;

  // Refactored fetchNews so it can be reused by the refresh button.
  const fetchNews = async () => {
    setLoading(true);
    setAlertMessage(""); // Clear previous alert message

    try {
      const response = await fetch(
        `https://newsdata.io/api/1/news?apikey=${newsKey}&category=entertainment&q=anime+crunchyroll&language=en`
      );
      const data = await response.json();
      
      if (data.results && data.results.length > 0) {
        setNews(data.results); // Set the fetched news
        setAlertMessage("News refreshed successfully!"); // Success message
        setAlertType("success"); // Set alert type to 'success'
      } else {
        setAlertMessage("No news found for the given query."); // No news message
        setAlertType("danger"); // Set alert type to 'danger'
      }
    } catch (error) {
      console.error("Error fetching news:", error);
      setNews([]); // Clear news on error
      setAlertMessage("Failed to fetch news. Please try again later."); // Error message
      setAlertType("danger"); // Set alert type to 'danger'
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

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

      {/* Responsive container for the page content */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="heading text-center mb-6">Anime News</h2>

        {/* Refresh News Button */}
        <div className="flex justify-center mb-4">
          <button
            onClick={fetchNews}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
          >
            Refresh News
          </button>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : news.length > 0 ? (
          <div className="space-y-4">
            {news.map((article, index) => (
              <div
                key={index}
                className="flex flex-col md:flex-row gap-4 p-4 rounded-lg bg-gradient-to-r from-red-400 to-red-600 text-white"
              >
                {article.image_url && (
                  <img
                    src={article.image_url}
                    alt={article.title}
                    className="image w-full md:w-1/3 object-cover rounded-lg"
                    style={{ height: "15rem" }}
                  />
                )}
                <div className="flex flex-col justify-center">
                  <a
                    href={article.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-lg font-semibold text-blue-600 hover:underline mb-2"
                  >
                    {article.title}
                  </a>
                  <p className="text-sm">{article.description}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center">No news available.</p>
        )}

        {/* Additional Footer Element */}
        <footer className="mt-8 text-center text-gray-300 text-sm">
          Powered by newsdata.io
        </footer>
      </div>
    </div>
  );
}
