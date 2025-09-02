import React from "react";
import { Routes, Route } from "react-router-dom";
import View from "./pages/viewpage";
import Home from "./pages/home";
import Login from "./pages/login";
import AnimeInfo from "./pages/info";
import News from "./pages/news";
import Explore from "./pages/explore";
import Signup from "./pages/singup"; 
import Watchlist from "./components/watchlist";
import Profile from "./components/profile";
import AuthWrapper from "./components/AuthWrapper"; 
import Review from "./components/reviews";
import Alert from "./components/flash";

function App() {
 

  return (
    <div>
    <Alert />
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<View />} />
      <Route path="/login" element={<Login />} />
      <Route path="/singup" element={<Signup />} /> 

      {/* Protected Routes */}
      <Route element={<AuthWrapper />}>
        <Route path="/home" element={<Home />} />
        <Route path="/info" element={<AnimeInfo />} />
        <Route path="/news" element={<News />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/watchlist" element={<Watchlist />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/reviews" element={<Review />} />
      </Route>
    </Routes>
    </div>
  );
}

export default App;
