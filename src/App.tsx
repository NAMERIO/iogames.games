import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameList from "./components/GameList";
import GameDetails from "./components/GameDetails";
import Account from "./components/Account";
import Profile from "./components/Profile";
import Background from "./components/Background";
import CursorTracker from "./components/CursorTracker";
// import Footer from "./components/Footer";
import "./index.css";

const App: React.FC = () => {
  return (
    <Router>
      <Background />
      <CursorTracker />
      <Account />
      <Routes>
        <Route path="/" element={<GameList />} />
        <Route path="/games/:id" element={<GameDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
      {/* <Footer /> */}
    </Router>
  );
};

export default App;
