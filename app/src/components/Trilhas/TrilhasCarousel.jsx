import React from "react";
import TrilhaCard from "./TrilhaCard";
import "./styles/TrilhasCarousel.css";

const TrilhasCarousel = ({ trilhas }) => {
  console.log("TrilhasCarousel recebeu:", trilhas);

  return (
    <div className="trilhas-carousel-container">
      {!trilhas || trilhas.length === 0 ? (
        <div className="trilhas-carousel">
          <div className="trilhas-empty">
            Nenhuma trilha encontrada para o filtro selecionado.
          </div>
        </div>
      ) : (
        <div className="trilhas-carousel">
          {trilhas.map((trilha) => (
            <TrilhaCard
              key={trilha.id}
              trilha={trilha}
              isProfessorView={false}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TrilhasCarousel;
