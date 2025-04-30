import React from "react";
import "./styles/ContinueLearning.css";
// Remova a importação dos ícones de navegação
import { FaCog } from "react-icons/fa";

const ContinueLearning = () => {
  return (
    <div className="continue-learning-container">
      <div className="continue-learning-header">
        <h2>Continue Learning</h2>
        {/* Removidos os botões de navegação */}
      </div>

      {/* Resto do componente permanece igual */}
      <div className="current-course-card">
        <div className="course-image-container">
          <div className="engineering-icon-container">
            <FaCog className="engineering-icon" />
          </div>
        </div>
        <div className="course-info">
          <h3>Introduction 3d Design</h3>
          <p className="instructor">Oliva Wilson | Expert 3d Designer</p>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress" style={{ width: "65%" }}></div>
            </div>
          </div>
          <p className="time-remaining">4 hours 25 minutes left</p>
        </div>
      </div>
    </div>
  );
};

export default ContinueLearning;
