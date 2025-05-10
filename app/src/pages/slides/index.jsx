import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import TextoSlide from "../../components/Slides/TextoSlide";
import TopicosSlide from "../../components/Slides/TopicosSlide";
import QuizSlide from "../../components/Slides/QuizSlide";
import ConclusaoSlide from "../../components/Slides/ConclusaoSlide";
import api from "../../services/api";
import "./slides-page.css";

const SlidesPage = () => {
  const { courseId } = useParams(); // Obter o ID do curso da URL
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [slideData, setSlideData] = useState(null);
  const [trilhaData, setTrilhaData] = useState(null);
  const [allSlides, setAllSlides] = useState([]); // Novo estado para armazenar todos os slides
  const [totalSlides, setTotalSlides] = useState(0);
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Referências para funções do quiz
  const quizNextRef = useRef(null);
  const quizPrevRef = useRef(null);

  // Carregar dados do curso e slides quando o componente montar
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      try {
        setLoading(true);
        const courseData = await api.getCourseById(courseId);

        if (courseData) {
          setTrilhaData({
            titulo: courseData.title,
            descricao: courseData.description,
            id: courseId
          });

          // Verificar se há conteúdo e slides
          if (courseData.steps?.content?.content_items) {
            const contentItems = courseData.steps.content.content_items;
            let slidesCollection = [];

            // Coletar todos os slides de todos os itens de conteúdo
            contentItems.forEach(item => {
              if (item.slides && item.slides.length > 0) {
                slidesCollection = [...slidesCollection, ...item.slides];
              }
            });

            if (slidesCollection.length > 0) {
              setAllSlides(slidesCollection); // Armazenar todos os slides
              setTotalSlides(slidesCollection.length);
              setSlideData(slidesCollection[0]); // Definir o primeiro slide
            } else {
              setError("Este curso não possui slides disponíveis.");
            }
          } else {
            setError("Este curso não possui conteúdo disponível.");
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados do curso:", err);
        setError("Não foi possível carregar os dados do curso. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Atualizar slide quando mudar o índice
  useEffect(() => {
    if (allSlides.length > 0 && currentSlideIndex >= 0 && currentSlideIndex < allSlides.length) {
      setSlideData(allSlides[currentSlideIndex]);
    }
  }, [currentSlideIndex, allSlides]);

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

    // Armazenar resultado do quiz (opcional, para uso futuro)
    const quizResults = JSON.parse(localStorage.getItem('quizResults') || '{}');
    quizResults[`${courseId}-${currentSlideIndex}`] = { score, total, timestamp: Date.now() };
    localStorage.setItem('quizResults', JSON.stringify(quizResults));

    // Avançar para o slide após o quiz
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Renderiza o conteúdo do slide com base no tipo  
  const renderSlideContent = () => {
    if (!slideData) return <div>Carregando...</div>;

    switch (slideData.tipo) {
      case "problema":
        return (
          <TextoSlide titulo={slideData.titulo} conteudo={slideData.conteudo} />
        );
      case "objetivos":
        return (
          <TopicosSlide titulo={slideData.titulo} topicos={slideData.objetivos} />
        );
      case "quiz_diagnostico":
      case "quiz_avaliativo":
        return (
          <QuizSlide
            titulo={slideData.titulo}
            perguntas={slideData.perguntas}
            onNext={quizNextRef}
            onPrev={quizPrevRef}
            onComplete={handleQuizComplete}
          />
        );
      case "conteudo":
        // Verifica se tem tópicos ou conteúdo em parágrafo
        if (slideData.topicos) {
          return (
            <TopicosSlide
              titulo={slideData.titulo}
              subtitulo={slideData.subtitulo}
              topicos={slideData.topicos}
            />
          );
        } else {
          return (
            <TextoSlide
              titulo={slideData.titulo}
              subtitulo={slideData.subtitulo}
              conteudo={slideData.paragrafo || slideData.conteudo}
            />
          );
        }
      case "resumo":
        return (
          <TextoSlide
            titulo={slideData.titulo}
            conteudo={slideData.conteudo}
            isResumo={true}
          />
        );
      default:
        return (
          <div>
            <h3>Tipo de slide não reconhecido: {slideData.tipo}</h3>
            <pre>{JSON.stringify(slideData, null, 2)}</pre>
          </div>
        );
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
      {loading ? (
        <div className="loading-message">Carregando conteúdo do curso...</div>
      ) : error ? (
        <div className="error-message">{error}</div>
      ) : (
        <>
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

          {/* Esconder botões de navegação durante quiz */}
          {(slideData?.tipo !== "quiz_diagnostico" && slideData?.tipo !== "quiz_avaliativo") && (
            <>
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
            </>
          )}
        </>
      )}
    </div>
  );
};

export default SlidesPage;
