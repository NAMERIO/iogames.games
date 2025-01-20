import React, { useState, useEffect } from "react";

const Footer: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [footerHeight, setFooterHeight] = useState(0);

  useEffect(() => {
    const footer = document.getElementById("footer");
    if (footer) {
      setFooterHeight(footer.offsetHeight);
    }

    const handleResize = () => {
      if (footer) {
        setFooterHeight(footer.offsetHeight);
      }
    };
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight;
      const threshold = document.body.scrollHeight - 30;

      if (scrollPosition >= threshold) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <>
      <style>{`body { padding-bottom: ${footerHeight}px; }`}</style>
      <footer
        id="footer"
        style={{
          ...footerStyle,
          transform: isVisible ? "translateY(0)" : "translateY(100%)",
          transition: "transform 0.3s ease-in-out",
        }}
      >
        <div style={containerStyle}>
          <div style={sectionStyle}>
            <h3>About Me</h3>
            <p>
              Welcome to our .io games site! Discover and play a variety of
              exciting io games, all in one place. This site code is on
              <a href="https://github/NAMERIO/iogames.games" style={linkStyle}>
                Github
              </a>
            </p>
          </div>
          <div style={sectionStyle}>
            <h3>Contact</h3>
            <p>Discord: @namerio</p>
            <p></p>
          </div>
          <div style={sectionStyle}>
            <h3>Follow Me</h3>
            <p>
              <a href="https://www.youtube.com/@namerio1" style={linkStyle}>
                Youtube
              </a>{" "}
              |{" "}
              <a href="https://github.com/NAMERIO" style={linkStyle}>
                Github
              </a>
            </p>
          </div>
        </div>
        <p style={copyrightStyle}>&copy; 2025 GameSite. All rights reserved.</p>
      </footer>
    </>
  );
};

const footerStyle: React.CSSProperties = {
  backgroundColor: "#282c34",
  color: "white",
  textAlign: "center",
  padding: "20px 0",
  width: "100%",
  position: "fixed",
  bottom: 0,
  left: 0,
  zIndex: 1000,
};

const containerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-around",
  flexWrap: "wrap",
  maxWidth: "1200px",
  margin: "0 auto",
};

const sectionStyle: React.CSSProperties = {
  flex: "1",
  padding: "10px",
  minWidth: "200px",
};

const linkStyle: React.CSSProperties = {
  color: "#6a0dad",
  textDecoration: "none",
};

const copyrightStyle: React.CSSProperties = {
  marginTop: "20px",
  fontSize: "14px",
  color: "#aaa",
};

export default Footer;
