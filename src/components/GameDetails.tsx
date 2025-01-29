import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import games from "../data/gamesData";

const GameDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [showShareCard, setShowShareCard] = useState(false);

  const game = games.find((g) => g.id === id);

  if (!game) {
    return <p>Game not found!</p>;
  }

  const goFullScreen = () => {
    const iframe = document.getElementById("game-frame") as HTMLIFrameElement;
    if (iframe.requestFullscreen) {
      iframe.requestFullscreen();
    }
  };

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href);
  };

  return (
    <div className="game-page">
      <div
        className={`game-details ${showShareCard ? "blurred-background" : ""}`}
      >
        <h1 className="game-title">{game.name}</h1>
        <div className="iframe-container">
          <iframe
            id="game-frame"
            src={game.url}
            title={game.name}
            style={{
              width: "90%",
              maxWidth: "800px",
              height: "450px",
              border: "none",
              display: "block",
              margin: "0 auto",
              borderRadius: "8px",
            }}
          ></iframe>
          <img
            src="/assets/icons/ui/fullscreen.png"
            alt="Fullscreen"
            className="fullscreen-button"
            onClick={goFullScreen}
          />
          <img
            src="/assets/icons/ui/home.png"
            alt="Home"
            className="home-button"
            onClick={() => navigate("/")}
          />
          <div className="action-buttons">
            <button
              className="share-button"
              onClick={() => setShowShareCard(!showShareCard)}
            >
              <img
                src="/assets/icons/ui/share.png"
                alt="Share"
                className="icon"
              />
              Share
            </button>
          </div>
          <div className="game-description">
            <p>{game.description}</p>
          </div>
        </div>
      </div>
      {showShareCard && (
        <div className="share-card">
          <img
            src="/assets/icons/ui/close.png"
            alt="Close"
            className="close-button"
            onClick={() => setShowShareCard(false)}
          />
          <p>Share this game:</p>
          <div className="share-link">
            <input
              type="text"
              value={window.location.href}
              readOnly
              onClick={(e) => (e.target as HTMLInputElement).select()}
            />
            <button className="copy-button" onClick={copyLinkToClipboard}>
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GameDetails;
