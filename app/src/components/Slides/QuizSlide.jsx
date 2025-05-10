import React, { useState, useEffect } from "react";
import "./QuizSlide.css";

// Dados de exemplo para as questões do quiz
const quizQuestions = [
  {
    pergunta:
      "Qual é o principal benefício da Inteligência Artificial na educação?",
    alternativas: [
      "Substituir completamente os professores",
      "Personalizar o aprendizado conforme as necessidades do aluno",
      "Eliminar a necessidade de avaliações",
      "Aumentar o custo da educação",
    ],
    resposta: 1,
  },
  {
    pergunta: "Qual das seguintes tecnologias NÃO é considerada parte da IA?",
    alternativas: [
      "Machine Learning",
      "Processamento de Linguagem Natural",
      "Bancos de dados relacionais",
      "Redes neurais",
    ],
    resposta: 2,
  },
  {
    pergunta: "Qual é um exemplo de aplicação ética da IA na educação?",
    alternativas: [
      "Monitorar alunos sem consentimento",
      "Compartilhar dados dos estudantes com terceiros",
      "Identificar alunos com dificuldades para oferecer suporte adicional",
      "Automatizar completamente o processo de avaliação",
    ],
    resposta: 2,
  },
];

const QuizSlide = ({ onNext, onPrev, onComplete }) => {
  const [questionIndex, setQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(quizQuestions.length).fill(null)
  );
  const [showSummary, setShowSummary] = useState(false);
  const [score, setScore] = useState(0);

  const currentQuestion = quizQuestions[questionIndex];

  // Processar as respostas e calcular a pontuação
  const processAnswers = () => {
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

  // Exibir o resumo final
  if (showSummary) {
    return (
      <div className="quiz-summary">
        <h2 className="quiz-summary-title">Resultado</h2>
        <div className="quiz-score">
          Você acertou {score} de {quizQuestions.length} questões!
          <div className="quiz-score-percentage">
            {Math.round((score / quizQuestions.length) * 100)}%
          </div>
        </div>

        <div className="quiz-review">
          {quizQuestions.map((question, index) => {
            const isCorrect = userAnswers[index] === question.resposta;
            return (
              <div
                key={index}
                className={`quiz-review-item ${
                  isCorrect ? "correct" : "incorrect"
                }`}
              >
                <div className="quiz-review-question">
                  <span className="quiz-review-number">{index + 1}.</span>
                  <span>{question.pergunta}</span>
                </div>
                <div className="quiz-review-answers">
                  <div>
                    <strong>Sua resposta:</strong>{" "}
                    {question.alternativas[userAnswers[index]]}
                    {isCorrect ? " ✓" : " ✗"}
                  </div>
                  {!isCorrect && (
                    <div>
                      <strong>Resposta correta:</strong>{" "}
                      {question.alternativas[question.resposta]}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // Exibir a questão atual
  return (
    <div className="quiz-slide-content">
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
    </div>
  );
};

export default QuizSlide;
