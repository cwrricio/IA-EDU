import React from "react";
import "./slides.css";

const TopicosSlide = ({ titulo, topicos }) => (
  <div className="slide-body">
    <h2 className="slide-title">{titulo}</h2>
    <ul className="slide-topicos">
      {topicos.map((topico, index) => (
        <li key={index} className="slide-topico-item">
          {topico}
        </li>
      ))}
    </ul>
    {/* Logo removido daqui */}
  </div>
);

export default TopicosSlide;
