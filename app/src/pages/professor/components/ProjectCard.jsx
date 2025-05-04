import React from "react";

const ProjectCard = ({ project }) => {
  const { title, status, date, description } = project;

  return (
    <div className="project-card">
      <h3 className="project-title">{title}</h3>
      <div className="project-info">
        <span className={`project-status ${status}`}>
          {status === "completed" ? "Concluída" : "Em andamento"}
        </span>
        <span className="project-date">{date}</span>
      </div>
      <p className="project-description">{description}</p>
      <div className="project-actions">
        <button className="project-view-btn">Ver trilha</button>
        <button className="project-edit-btn">Editar</button>
      </div>
    </div>
  );
};

const TrilhaCard = ({ trilha }) => {
  const { id, title, status, date, description } = trilha;

  return (
    <div className="trilha-card">
      <h3 className="trilha-titulo">{title}</h3>

      <div className="trilha-status-container">
        <span className="trilha-status">
          {status === "em andamento" ? "em andamento" : "concluída"}
        </span>
        <span className="trilha-data">{date}</span>
      </div>

      <p className="trilha-descricao">{description}</p>

      <div className="trilha-acoes">
        <button className="ver-trilha-btn">Ver trilha</button>
        <button className="editar-btn">Editar</button>
      </div>
    </div>
  );
};

export { ProjectCard, TrilhaCard };
