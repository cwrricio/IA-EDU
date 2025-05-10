import React from "react";
import "./slideLayout.css";

const SlideLayout = ({ children }) => {
  return (
    <div className="slide-layout">
      <div className="slide-container">
        <div className="slide-content">{children}</div>
      </div>
      <div className="slide-controls">
        <button className="slide-control-btn prev">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>
        <div className="slide-indicator">Slide 1 / 10</div>
        <button className="slide-control-btn next">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SlideLayout;
