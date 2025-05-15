import React from "react";
import "./slides.css";

const TopicosSlide = ({ titulo, topicos }) => (
  <div className="slide-body">
    <h2 className="slide-title">{titulo}</h2>
    <ul className="slide-topicos">
      {topicos.map((topico, index) => (
        <li key={index} className="slide-topico-item">
          {/* Verifica se o tópico é um objeto ou uma string */}
          {typeof topico === "object" && topico !== null
            ? topico.topico || topico.descricao || "Tópico sem descrição"
            : topico}
        </li>
      ))}
    </ul>
  </div>
);

export default TopicosSlide;
