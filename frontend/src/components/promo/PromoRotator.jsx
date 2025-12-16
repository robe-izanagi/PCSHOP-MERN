import React, { useEffect, useState } from "react";

const PromoRotator = () => {
  const quotes = [
    "Power your game. Dominate every battle.",
    "Unleash performance beyond limits.",
    "Precision, speed, and style. Built for true gamers.",
    "Your next upgrade starts here.",
    "Experience flawless power and efficiency.",
    "Engineered for champions. Made for you.",
    "Turn every click into victory.",
    "Performance that never backs down.",
    "Next-level hardware for next-level players.",
    "Your build. Your rules. ROG style.",
  ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % quotes.length);
    }, 8000);

    return () => clearInterval(id);
  }, []);

  return (
    <p
      style={{
        fontSize: "20px",
        fontWeight: "600",
        transition: "opacity 0.6s ease",
        opacity: 1,
      }}
    >
      {quotes[index]}
    </p>
  );
};

export default PromoRotator;
