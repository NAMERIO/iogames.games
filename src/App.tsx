import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import GameList from "./components/GameList";
import GameDetails from "./components/GameDetails";
import Account from "./components/Account";
import Profile from "./components/Profile";
import CursorTracker from "./components/CursorTracker";
import "./index.css";

const App: React.FC = () => {
  return (
    <Router>
      <CursorTracker />
      <Account />
      <Routes>
        <Route path="/" element={<GameList />} />
        <Route path="/games/:id" element={<GameDetails />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
};

export default App;
