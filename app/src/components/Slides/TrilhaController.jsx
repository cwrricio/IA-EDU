import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import TextoSlide from "./TextoSlide";
import TopicosSlide from "./TopicosSlide";
import QuizSlide from "./QuizSlide";
import ConclusaoSlide from "./ConclusaoSlide";
import SlideNavigation from "./SlideNavigation";
import "./slides.css";

const TrilhaController = ({ trilha }) => {
  const navigate = useNavigate();
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [quizResults, setQuizResults] = useState([]);

  const currentModule = trilha.modulos[currentModuleIndex];
  const currentSlide = currentModule?.slides[currentSlideIndex];
  const isLastModule = currentModuleIndex === trilha.modulos.length - 1;
  const isLastSlideInModule =
    currentSlideIndex === currentModule?.slides.length - 1;
  const isFinalSlide = isLastModule && isLastSlideInModule;

  useEffect(() => {
    // Iniciar do começo quando a trilha muda
    setCurrentModuleIndex(0);
    setCurrentSlideIndex(0);
    setQuizResults([]);
  }, [trilha]);

  // Navegar para o próximo slide ou módulo
  const handleNext = () => {
    if (isLastSlideInModule) {
      if (isLastModule) {
        // Final da trilha - mostrar tela de conclusão ou navegar
        navigate("/trilhas");
      } else {
        // Ir para o próximo módulo
        setCurrentModuleIndex((prevIndex) => prevIndex + 1);
        setCurrentSlideIndex(0);
      }
    } else {
      // Próximo slide no módulo atual
      setCurrentSlideIndex((prevIndex) => prevIndex + 1);
    }
  };

  // Navegar para o slide ou módulo anterior
  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setCurrentSlideIndex((prevIndex) => prevIndex - 1);
    } else if (currentModuleIndex > 0) {
      setCurrentModuleIndex((prevIndex) => prevIndex - 1);
      setCurrentSlideIndex(
        trilha.modulos[currentModuleIndex - 1].slides.length - 1
      );
    }
  };

  // Lidar com a conclusão de um quiz
  const handleQuizComplete = (results) => {
    setQuizResults((prev) => [
      ...prev,
      {
        moduleIndex: currentModuleIndex,
        ...results,
      },
    ]);
    handleNext();
  };

  // Renderizar o slide atual baseado em seu tipo
  const renderCurrentSlide = () => {
    if (!currentSlide) return null;

    switch (currentSlide.tipo) {
      case "texto":
        return (
          <TextoSlide
            conteudo={currentSlide.conteudo}
            trilha={trilha.nome}
            titulo={currentModule.titulo}
          />
        );

      case "topicos":
        return (
          <TopicosSlide
            conteudo={currentSlide.conteudo}
            trilha={trilha.nome}
            titulo={currentModule.titulo}
          />
        );

      case "quiz":
        return (
          <QuizSlide
            conteudo={currentSlide.conteudo}
            trilha={trilha.nome}
            onQuizComplete={handleQuizComplete}
          />
        );

      case "conclusao":
        return (
          <ConclusaoSlide
            conteudo={currentSlide.conteudo}
            trilha={trilha.nome}
            isTrilhaFinal={isFinalSlide}
          />
        );

      default:
        return <div>Tipo de slide não suportado</div>;
    }
  };

  // Determinar se deve mostrar a navegação padrão ou não
  const shouldShowNavigation = () => {
    // Não mostrar navegação em slides de quiz ou conclusão final
    if (
      currentSlide?.tipo === "quiz" ||
      (currentSlide?.tipo === "conclusao" && isFinalSlide)
    ) {
      return false;
    }
    return true;
  };

  // Contar o número total de slides em todos os módulos
  const totalSlides = trilha.modulos.reduce(
    (total, modulo) => total + modulo.slides.length,
    0
  );

  // Calcular o índice global do slide atual (considerando todos os módulos)
  const currentGlobalSlideIndex =
    trilha.modulos
      .slice(0, currentModuleIndex)
      .reduce((sum, modulo) => sum + modulo.slides.length, 0) +
    currentSlideIndex;

  return (
    <div className="slides-container">
      <div className="slide-content">{renderCurrentSlide()}</div>

      {shouldShowNavigation() && (
        <SlideNavigation
          onNext={handleNext}
          onPrev={handlePrev}
          canGoPrev={currentModuleIndex > 0 || currentSlideIndex > 0}
          canGoNext={true}
          currentIndex={currentGlobalSlideIndex}
          totalSlides={totalSlides}
          nextText={
            isLastSlideInModule && !isLastModule ? "Próximo Módulo" : "Próximo"
          }
          showIndicator={true}
        />
      )}
    </div>
  );
};

export default TrilhaController;
