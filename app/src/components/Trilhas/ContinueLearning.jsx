import React from "react";
import "./styles/ContinueLearning.css";
import { FaCog } from "react-icons/fa";
import { PiStudent } from "react-icons/pi";

const ContinueLearning = () => {
  return (
    <div className="continue-learning-container">
      <div className="continue-learning-header">
        <h2>Continue Aprendendo</h2>
      </div>

      <div className="current-course-card">
        <div className="course-image-container">
          <div className="engineering-icon-container">
            <PiStudent className="engineering-icon" />
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
