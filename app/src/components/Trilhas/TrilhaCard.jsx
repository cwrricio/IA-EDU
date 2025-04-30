import React from "react";
import StatusBadge from "./StatusBadge";
import codefolioImg from "../../assets/codefolio.png";
import "./styles/TrilhaCard.css";

const TrilhaCard = ({ trilha }) => {
  const { title, instructor, status, description } = trilha;

  return (
    <div className="trilha-card">
      <div className="trilha-image-container">
        <div className="trilha-image">
          <div className="trilha-image-wrapper">
            <img src={codefolioImg} alt={title} />
          </div>
        </div>
      </div>

      <h3 className="trilha-title">{title}</h3>

      <div className="trilha-info">
        <div className="instructor-info">
          <div className="instructor-avatar">
            <img src={instructor.avatar} alt={instructor.name} />
          </div>
          <div className="instructor-details">
            <div className="instructor-name">{instructor.name}</div>
            <div className="instructor-role">{instructor.role}</div>
          </div>
        </div>

        <StatusBadge status={status} />
      </div>

      <p className="trilha-description">{description}</p>

      <div className="trilha-actions">
        <button className="trilha-button">
          {status === "concluido" ? "Ver detalhes" : "Continuar"}
        </button>
      </div>
    </div>
  );
};

export default TrilhaCard;
