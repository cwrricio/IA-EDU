import React from "react";
import { useNavigate } from "react-router-dom";
import "./ConclusaoSlide.css";

const ConclusaoSlide = ({
  titulo,
  mensagem,
  quizScore,
  onComplete,
  buttonText = "Voltar para Trilhas",
}) => {
  const navigate = useNavigate();

  const handleButtonClick = () => {
    if (onComplete) {
      onComplete();
    } else {
      navigate("/trilhas");
    }
  };

  return (
    <div className="conclusao-slide">
      <div className="conclusao-content">
        <h2 className="conclusao-titulo">{titulo}</h2>

        <div className="conclusao-badge">
          <div className="conclusao-badge-icon">🏆</div>
          <div className="conclusao-badge-text">CONTEÚDO Concluído</div>
        </div>

        <div className="conclusao-mensagem">
          <p>{mensagem}</p>

          {quizScore && quizScore.total > 0 && (
            <div className="conclusao-score">
              <strong>Resultado do Quiz:</strong> {quizScore.score} de{" "}
              {quizScore.total} questões
              <div className="conclusao-score-percentage">
                {Math.round((quizScore.score / quizScore.total) * 100)}%
              </div>
            </div>
          )}
        </div>

        <button className="conclusao-button" onClick={handleButtonClick}>
          {buttonText}
        </button>
      </div>
    </div>
  );
};

export default ConclusaoSlide;
