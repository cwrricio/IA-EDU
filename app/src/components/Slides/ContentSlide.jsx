import React from "react";

const ContentSlide = ({ titulo, conteudo }) => {
  return (
    <>
      <h1 className="slide-title">{titulo}</h1>
      <div className="slide-text">
        <p>{conteudo}</p>
      </div>
    </>
  );
};

export default ContentSlide;
