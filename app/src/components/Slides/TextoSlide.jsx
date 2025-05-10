import React from "react";
import "./slides.css";

// Modifique o TextoSlide para não incluir o logo
const TextoSlide = ({ titulo, conteudo }) => (
  <div className="slide-body">
    <h2 className="slide-title">{titulo}</h2>
    <div className="slide-text">{conteudo}</div>
    {/* Remova qualquer renderização de logo aqui */}
  </div>
);

export default TextoSlide;
