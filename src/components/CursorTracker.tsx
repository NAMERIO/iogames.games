import React, { useEffect, useState } from "react";

const CursorTracker: React.FC = () => {
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [trackerPosition, setTrackerPosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCursorPosition({ x: e.clientX, y: e.clientY });
    };

    document.addEventListener("mousemove", handleMouseMove);
    return () => document.removeEventListener("mousemove", handleMouseMove);
  }, []);

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      setTrackerPosition((prev) => ({
        x: prev.x + (cursorPosition.x - prev.x) * 0.1,
        y: prev.y + (cursorPosition.y - prev.y) * 0.1,
      }));

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();
    return () => cancelAnimationFrame(animationFrameId);
  }, [cursorPosition]);

  return (
    <div
      style={{
        position: "fixed",
        top: trackerPosition.y,
        left: trackerPosition.x,
        width: "50px",
        height: "50px",
        border: "2px solid white",
        borderRadius: "50%",
        background: "transparent",
        pointerEvents: "none",
        transform: "translate(-50%, -50%)",
        zIndex: 9999,
      }}
    />
  );
};

export default CursorTracker;
