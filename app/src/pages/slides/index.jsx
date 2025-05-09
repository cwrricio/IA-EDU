import React, { useState, useEffect, useRef } from "react";
import TextoSlide from "../../components/Slides/TextoSlide";
import TopicosSlide from "../../components/Slides/TopicosSlide";
import QuizSlide from "../../components/Slides/QuizSlide";
import ConclusaoSlide from "../../components/Slides/ConclusaoSlide";
import { mockTrilha } from "../../components/data/mockTrilha";
import "./slides-page.css";

const SlidesPage = () => {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideData, setSlideData] = useState(null);
  const [trilhaData, setTrilhaData] = useState(null);
  const [totalSlides, setTotalSlides] = useState(0);
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 });

  // Referências para funções do quiz
  const quizNextRef = useRef(null);
  const quizPrevRef = useRef(null);

  // Carregue os dados da primeira trilha ao iniciar
  useEffect(() => {
    if (Array.isArray(mockTrilha) && mockTrilha.length > 0) {
      // Utilize a primeira trilha disponível
      const primeiraTriha = mockTrilha[0];
      setTrilhaData(primeiraTriha);

      if (primeiraTriha.slides && primeiraTriha.slides.length > 0) {
        setSlideData(primeiraTriha.slides[currentSlideIndex]);
        setTotalSlides(primeiraTriha.slides.length);
      }
    } else {
      console.error("Dados não disponíveis ou em formato incorreto");
    }
  }, [currentSlideIndex]);

  // Navegar para o próximo slide (ou próxima pergunta no quiz)
  const nextSlide = () => {
    // Verificar se estamos em um quiz
    if (slideData?.tipo === "quiz" && quizNextRef.current) {
      // Tentativa de navegar dentro do quiz
      const navigatedInQuiz = quizNextRef.current();

      // Se não navegou dentro do quiz, só então avança para o próximo slide
      if (!navigatedInQuiz && currentSlideIndex < totalSlides - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }
    }
    // Caso não seja um quiz, comportamento normal
    else if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Navegar para o slide anterior (ou pergunta anterior no quiz)
  const prevSlide = () => {
    // Verificar se estamos em um quiz
    if (slideData?.tipo === "quiz" && quizPrevRef.current) {
      // Tentativa de navegar dentro do quiz
      const navigatedInQuiz = quizPrevRef.current();

      // Se não navegou dentro do quiz, só então volta para o slide anterior
      if (!navigatedInQuiz && currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      }
    }
    // Caso não seja um quiz, comportamento normal
    else if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Handler para quando o quiz for completado
  const handleQuizComplete = (score, total) => {
    setQuizScore({ score, total });
    // Avançar para o slide após o quiz
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Renderiza o conteúdo do slide com base no tipo
  const renderSlideContent = () => {
    if (!slideData) return <div>Carregando...</div>;

    switch (slideData.tipo) {
      case "texto":
        return (
          <TextoSlide titulo={slideData.titulo} conteudo={slideData.conteudo} />
        );
      case "topicos":
        return (
          <TopicosSlide titulo={slideData.titulo} topicos={slideData.topicos} />
        );
      case "quiz":
        return (
          <QuizSlide
            onNext={quizNextRef}
            onPrev={quizPrevRef}
            onComplete={handleQuizComplete}
          />
        );
      case "conclusao":
        return (
          <ConclusaoSlide
            titulo="Parabéns!"
            mensagem={`Você concluiu a TRILHA de "${trilhaData?.titulo}" com sucesso! Continue explorando mais conteúdos para aprimorar seus conhecimentos.`}
            quizScore={quizScore}
          />
        );
      default:
        return <div>Tipo de slide não reconhecido</div>;
    }
  };

  // Verificar se o botão próximo deve estar desabilitado
  const isNextButtonDisabled = () => {
    // No último slide
    if (currentSlideIndex === totalSlides - 1) {
      return true;
    }

    // Em um quiz, verificar se pode avançar
    if (slideData?.tipo === "quiz" && quizNextRef.current) {
      // Tenta avançar no quiz sem realmente mudar o estado
      // Se não conseguir avançar (nenhuma opção selecionada), desabilita o botão
      const canAdvance = quizNextRef.current && quizNextRef.current();
      
      // Se retornar false, significa que não há opção selecionada
      // ou estamos na última pergunta do quiz
      if (!canAdvance) {
        return true;
      }
      
      // Desfaz a mudança que testamos (para não avançar realmente)
      quizPrevRef.current && quizPrevRef.current();
    }

    return false;
  };

  return (
    <div className="slides-page-container">
      <div className="slide-box">
        <div className="slide-header">
          <div className="slide-logo">
            <img src="/mentor.svg" alt="MentorIA" />
          </div>
          <h3 className="slide-trilha">
            {trilhaData?.titulo || "Nome da Trilha"}
          </h3>
        </div>
        <div className="slide-content-block">{renderSlideContent()}</div>
      </div>

      <button
        className="nav-button prev"
        onClick={prevSlide}
        disabled={currentSlideIndex === 0}
        aria-label="Slide anterior"
      >
        &#10094;
      </button>

      <button
        className="nav-button next"
        onClick={nextSlide}
        disabled={isNextButtonDisabled()}
        aria-label="Próximo slide"
      >
        &#10095;
      </button>

      <div className="slide-indicator">
        {currentSlideIndex + 1} / {totalSlides}
      </div>
    </div>
  );
};

export default SlidesPage;
