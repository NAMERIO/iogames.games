import React, { useEffect } from "react";
import "../index.css";

interface BackgroundProps {
  speedMultiplier?: number;
}

const Background: React.FC<BackgroundProps> = ({ speedMultiplier = 0.7 }) => {
  useEffect(() => {
    const canvas = document.getElementById("snow-canvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d");

    let particles: { x: number; y: number; radius: number; speed: number }[] =
      [];
    const particleCount = 150;

    const createParticles = () => {
      for (let i = 0; i < particleCount; i++) {
        particles.push({
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          radius: Math.random() * 3 + 1,
          speed: (Math.random() * 2 + 0.5) * speedMultiplier,
        });
      }
    };

    const updateParticles = () => {
      particles.forEach((particle) => {
        particle.y += particle.speed;
        if (particle.y > window.innerHeight) {
          particle.y = 0;
          particle.x = Math.random() * window.innerWidth;
        }
      });
    };

    const drawParticles = () => {
      ctx!.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((particle) => {
        ctx!.beginPath();
        ctx!.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx!.fillStyle = "white";
        ctx!.fill();
        ctx!.closePath();
      });
    };

    const animate = () => {
      updateParticles();
      drawParticles();
      requestAnimationFrame(animate);
    };

    const setupCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      particles = [];
      createParticles();
      animate();
    };

    setupCanvas();
    window.addEventListener("resize", setupCanvas);

    return () => window.removeEventListener("resize", setupCanvas);
  }, [speedMultiplier]);

  return <canvas id="snow-canvas"></canvas>;
};

export default Background;
