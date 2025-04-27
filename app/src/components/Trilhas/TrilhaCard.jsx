import React from "react";
import StatusBadge from "./StatusBadge";
import codefolioImg from "../../assets/codefolio.png"; // Certifique-se de adicionar a imagem ao projeto
import "./styles/TrilhaCard.css";

const TrilhaCard = ({ trilha }) => {
  const { title, instructor, status, description } = trilha;

  return (
    <div className="trilha-card">
      <div className="trilha-image">
        <img src={codefolioImg} alt={title} />
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
    </div>
  );
};

export default TrilhaCard;
