import React from "react";
import TrilhaCard from "./TrilhaCard";
import "./styles/TrilhasCarousel.css";

const TrilhasCarousel = ({ trilhas }) => {
  return (
    <div className="trilhas-carousel-container">
      <div className="trilhas-carousel">
        {trilhas.map((trilha) => (
          <TrilhaCard key={trilha.id} trilha={trilha} />
        ))}
      </div>
    </div>
  );
};

export default TrilhasCarousel;
