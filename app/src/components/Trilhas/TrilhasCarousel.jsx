import React from "react";
import TrilhaCard from "./TrilhaCard";
import "./styles/TrilhasCarousel.css";

const TrilhasCarousel = ({ trilhas }) => {
  // Se não houver trilhas, exibir mensagem
  if (!trilhas || trilhas.length === 0) {
    return <div className="trilhas-empty">Nenhuma trilha disponível</div>;
  }

  return (
    <div className="trilhas-carousel-container">
      <div className="trilhas-carousel">
        {trilhas.map((trilha) => (
          <TrilhaCard
            key={trilha.id}
            trilha={trilha}
            isProfessorView={false} // Adicionar explicitamente para garantir
          />
        ))}
      </div>
    </div>
  );
};

export default TrilhasCarousel;
