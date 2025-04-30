import React from "react";
import "./styles/QuadradoDaTrilha.css";

const QuadradoDaTrilha = () => {
  return (
    <div className="quadrado-trilha-container">
      <div className="special-tag">Special for you!</div>
      <div className="quadrado-content">
        <h2>Subscribe Now!</h2>
        <button className="get-started-button">
          Get Started
          <span className="arrow-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h13M12 5l7 7-7 7" />
            </svg>
          </span>
        </button>
      </div>
    </div>
  );
};

export default QuadradoDaTrilha;
