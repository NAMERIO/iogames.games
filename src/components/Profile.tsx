import React from "react";
import { useNavigate } from "react-router-dom";

const Profile: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div style={{ position: "relative", height: "100vh" }}>
      <img
        src="/assets/icons/ui/home.png"
        alt="Home"
        className="home-button"
        onClick={() => navigate("/")}
        style={{
          position: "absolute",
          top: "-150px",
          left: "20px",
          cursor: "pointer",
          width: "40px",
          height: "40px",
        }}
      />
      <div
        style={{
          textAlign: "center",
          marginTop: "100px",
          fontSize: "40px",
          fontFamily: "Roboto, sans-serif",
          fontWeight: 500,
        }}
      >
        <p>Profile</p>
        <p>🚧In development🚧</p>
      </div>
    </div>
  );
};

export default Profile;
