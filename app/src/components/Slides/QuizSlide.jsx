import React, { useState, useEffect } from "react";
import "./QuizSlide.css";

const QuizSlide = ({ titulo, perguntas, onNext, onPrev, onComplete }) => {
  // Usar as perguntas recebidas via props em vez de usar os dados de exemplo fixos
  const quizQuestions = perguntas || [];

  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);

  // Atualizar estado de respostas quando as perguntas mudarem
  useEffect(() => {
    setUserAnswers(Array(quizQuestions.length).fill(null));
    setShowSummary(false);
    setQuestionIndex(0);
    setScore(0);
  }, [perguntas]);

  const currentQuestion = quizQuestions[questionIndex] || {
    pergunta: "Carregando...",
    alternativas: [],
    resposta: 0,
  };

  // Processar as respostas e calcular a pontuação
  const processAnswers = () => {
    if (!quizQuestions.length) return;

    let correctAnswers = 0;
    userAnswers.forEach((answer, index) => {
      if (answer === quizQuestions[index].resposta) {
        correctAnswers++;
      }
    });
    setScore(correctAnswers);
    setShowSummary(true);
  };

  // Selecionar uma opção
  const handleOptionSelect = (index) => {
    const newAnswers = [...userAnswers];
    newAnswers[questionIndex] = index;
    setUserAnswers(newAnswers);
  };

  // Verificar se pode avançar na questão atual
  const canAdvanceCurrentQuestion = () => {
    return userAnswers[questionIndex] !== null || showSummary;
  };

  // Avançar para a próxima questão
  const goToNextQuestion = () => {
    if (!canAdvanceCurrentQuestion()) return false;

    if (questionIndex < quizQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
      return true;
    } else if (!showSummary) {
      processAnswers();
      return true;
    } else {
      if (onComplete) onComplete(score, quizQuestions.length);
      return false;
    }
  };

  // Voltar para a questão anterior
  const goToPrevQuestion = () => {
    if (questionIndex > 0) {
      setQuestionIndex(questionIndex - 1);
      return true;
    }
    return false;
  };

  // Expor os métodos de navegação para o componente pai
  useEffect(() => {
    if (onNext) {
      onNext.current = goToNextQuestion;
    }
    if (onPrev) {
      onPrev.current = goToPrevQuestion;
    }
  }, [questionIndex, userAnswers, showSummary, score]);

  // Verificar se há perguntas
  if (!quizQuestions || quizQuestions.length === 0) {
    return (
      <div className="quiz-error">
        <h2>Erro: Nenhuma pergunta disponível</h2>
        <p>Não foi possível carregar as perguntas para este quiz.</p>
      </div>
    );
  }

  // 1. Para o modo de perguntas (não summary)
  if (!showSummary) {
    return (
      <div className="quiz-slide-content">
        <h2 className="quiz-title">{titulo || "Quiz"}</h2>

        <div className="quiz-progress">
          <span>
            Questão {questionIndex + 1} de {quizQuestions.length}
          </span>
          <div className="quiz-progress-bar">
            <div
              className="quiz-progress-fill"
              style={{
                width: `${((questionIndex + 1) / quizQuestions.length) * 100}%`,
              }}
            ></div>
          </div>
        </div>

        <div className="quiz-question">
          <p>{currentQuestion.pergunta}</p>
        </div>

        <div className="quiz-options">
          {currentQuestion.alternativas.map((alternativa, index) => (
            <div
              key={index}
              className={`quiz-option ${
                userAnswers[questionIndex] === index ? "selected" : ""
              }`}
              onClick={() => handleOptionSelect(index)}
            >
              <div className="quiz-option-content">
                <span className="quiz-option-text">{alternativa}</span>
              </div>
            </div>
          ))}
        </div>

        {userAnswers[questionIndex] === null && (
          <div className="quiz-select-hint">
            Selecione uma opção para continuar
          </div>
        )}

        <div className="quiz-navigation">
          {questionIndex > 0 && (
            <button className="quiz-nav-button prev" onClick={goToPrevQuestion}>
              Anterior
            </button>
          )}
          <div className="quiz-nav-spacer"></div>
          <button
            className="quiz-nav-button next"
            onClick={goToNextQuestion}
            disabled={userAnswers[questionIndex] === null}
          >
            {questionIndex < quizQuestions.length - 1 ? "Próxima" : "Finalizar"}
          </button>
        </div>
      </div>
    );
  }

  // 2. Para o modo de resumo
  return (
    <div className="quiz-summary">
      <div className="quiz-results-header">
        <h2 className="quiz-summary-title">{titulo || "Resultado do Quiz"}</h2>

        <div className="score-container">
          <div className="score-circle">
            <div className="score-number">
              {Math.round((score / quizQuestions.length) * 100)}%
            </div>
            <svg className="progress-ring" width="100" height="100">
              <circle
                className="progress-ring-circle-bg"
                strokeWidth="8"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
              />
              <circle
                className={`progress-ring-circle ${
                  score / quizQuestions.length >= 0.7
                    ? "high"
                    : score / quizQuestions.length >= 0.4
                    ? "medium"
                    : "low"
                }`}
                strokeWidth="8"
                fill="transparent"
                r="42"
                cx="50"
                cy="50"
                strokeDasharray={`${2 * Math.PI * 42}`}
                strokeDashoffset={
                  2 * Math.PI * 42 * (1 - score / quizQuestions.length)
                }
              />
            </svg>
          </div>
          <div className="score-details">
            <div className="score-text">
              Você acertou <span className="score-highlight">{score}</span> de{" "}
              <span className="total-questions">{quizQuestions.length}</span>{" "}
              questões!
            </div>
            <div className="score-feedback">
              {score === quizQuestions.length
                ? "Excelente! Você domina este conteúdo."
                : score >= quizQuestions.length * 0.7
                ? "Muito bom! Você está no caminho certo."
                : score >= quizQuestions.length * 0.5
                ? "Bom trabalho! Continue estudando."
                : "Continue praticando para melhorar seu conhecimento."}
            </div>
          </div>
        </div>
      </div>

      <h3 className="review-section-title">Revisão das Questões</h3>

      <div className="quiz-review">
        {quizQuestions.map((question, index) => {
          const isCorrect = userAnswers[index] === question.resposta;
          return (
            <div
              key={index}
              className={`quiz-review-item ${isCorrect ? "correct" : "incorrect"}`}
            >
              <div className="review-item-header">
                <span className="question-number">Questão {index + 1}</span>
                <span className={`status-badge ${isCorrect ? "correct" : "incorrect"}`}>
                  {isCorrect ? "Acertou" : "Errou"}
                </span>
              </div>
              
              <div className="review-item-content">
                <div className="review-question">{question.pergunta}</div>
                
                <div className="review-answers">
                  <div className="user-answer">
                    <span className="answer-label">Sua resposta:</span>
                    <span className={`answer-value ${isCorrect ? "correct-text" : "incorrect-text"}`}>
                      {question.alternativas[userAnswers[index]]}
                    </span>
                  </div>
                  
                  {!isCorrect && (
                    <div className="correct-answer">
                      <span className="answer-label">Resposta correta:</span>
                      <span className="answer-value correct-text">
                        {question.alternativas[question.resposta]}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="quiz-completion">
        <button
          className="quiz-complete-button"
          onClick={() => onComplete && onComplete(score, quizQuestions.length)}
        >
          Continuar
        </button>
      </div>
    </div>
  );
};

export default QuizSlide;
