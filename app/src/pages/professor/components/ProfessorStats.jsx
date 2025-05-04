import React from "react";
import { FaGraduationCap, FaBook, FaUser, FaClock } from "react-icons/fa";

const ProfessorStats = () => {
  return (
    <div className="professor-stats-card">
      <h2>Estatísticas de Ensino</h2>

      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-icon">
            <FaGraduationCap />
          </div>
          <div className="stat-details">
            <div className="stat-value">12</div>
            <div className="stat-label">Disciplinas</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <FaUser />
          </div>
          <div className="stat-details">
            <div className="stat-value">356</div>
            <div className="stat-label">Alunos</div>
          </div>
        </div>
      </div>

      <div className="stats-row">
        <div className="stat-item">
          <div className="stat-icon">
            <FaBook />
          </div>
          <div className="stat-details">
            <div className="stat-value">48</div>
            <div className="stat-label">Materiais</div>
          </div>
        </div>

        <div className="stat-item">
          <div className="stat-icon">
            <FaClock />
          </div>
          <div className="stat-details">
            <div className="stat-value">278h</div>
            <div className="stat-label">Horas de aula</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorStats;
