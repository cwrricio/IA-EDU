import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import TextoSlide from "../../components/Slides/TextoSlide";
import TopicosSlide from "../../components/Slides/TopicosSlide";
import QuizSlide from "../../components/Slides/QuizSlide";
import ConclusaoSlide from "../../components/Slides/ConclusaoSlide";
import api from "../../services/api";
import "./slides-page.css";

const SlidesPage = () => {
  const { courseId, contentId } = useParams();
  const navigate = useNavigate();
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const [slideData, setSlideData] = useState(null);
  const [trilhaData, setTrilhaData] = useState(null);
  const [contentItems, setContentItems] = useState([]);
  const [currentContentSlides, setCurrentContentSlides] = useState([]);
  const [totalSlides, setTotalSlides] = useState(0);
  const [quizScore, setQuizScore] = useState({ score: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showContentCompletion, setShowContentCompletion] = useState(false);
  const [showCourseCompletion, setShowCourseCompletion] = useState(false);
  const [showSkipNotification, setShowSkipNotification] = useState(false);
  const [regeneratingContent, setRegeneratingContent] = useState(false);
  const [regeneratedSlides, setRegeneratedSlides] = useState(null);

  // Referências para funções do quiz
  const quizNextRef = useRef(null);
  const quizPrevRef = useRef(null);

  // Carregar dados do curso e slides iniciais
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) return;

      // Obter o parâmetro de slide da URL
      const urlParams = new URLSearchParams(window.location.search);
      let initialSlide = parseInt(urlParams.get('slide')) || 0;

      // Verificar se há um slide forçado armazenado
      const forcedSlide = sessionStorage.getItem('forceInitialSlide');
      if (forcedSlide) {
        // Usar o slide forçado em vez do parâmetro URL
        initialSlide = parseInt(forcedSlide);
        // Limpar após uso
        sessionStorage.removeItem('forceInitialSlide');
        console.log("Using forced slide index:", initialSlide);
      }

      try {
        setLoading(true);
        const courseData = await api.getCourseById(courseId);

        if (courseData) {
          setTrilhaData({
            titulo: courseData.title,
            descricao: courseData.description,
            id: courseId,
          });

          // Verificar se há conteúdo e slides
          if (courseData.steps?.content?.content_items) {
            const items = courseData.steps.content.content_items;
            setContentItems(items);

            // Se o contentId foi fornecido, ir direto para esse conteúdo
            if (contentId) {
              const contentIndex = items.findIndex(item => item.id.toString() === contentId);
              if (contentIndex >= 0) {
                // Pass the initialSlide to loadContentSlides
                loadContentSlides(items, contentIndex, initialSlide);
                setCurrentContentIndex(contentIndex);
              } else {
                // Se o contentId não for válido, usar o primeiro
                loadContentSlides(items, 0, initialSlide);
              }
            } else {
              // Se não foi fornecido contentId, carrega o primeiro conteúdo
              loadContentSlides(items, 0, initialSlide);
            }
          } else {
            setError("Este curso não possui conteúdo disponível.");
          }
        }
      } catch (err) {
        console.error("Erro ao carregar dados do curso:", err);
        setError(
          "Não foi possível carregar os dados do curso. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId, contentId]);

  // Função para carregar os slides de um conteúdo específico
  const loadContentSlides = (items, contentIndex, initialSlideIndex = 0) => {
    const currentItem = items[contentIndex];

    if (currentItem && currentItem.slides && currentItem.slides.length > 0) {
      setCurrentContentSlides(currentItem.slides);
      setTotalSlides(currentItem.slides.length);
      setCurrentSlideIndex(initialSlideIndex);
      setSlideData(currentItem.slides[initialSlideIndex < currentItem.slides.length ? initialSlideIndex : 0]);
      setShowContentCompletion(false);
      setShowSkipNotification(false);
    } else {
      setError(`O conteúdo ${contentIndex + 1} não possui slides.`);
    }
  };

  // Atualizar slide quando mudar o índice
  useEffect(() => {
    if (
      currentContentSlides.length > 0 &&
      currentSlideIndex >= 0 &&
      currentSlideIndex < currentContentSlides.length
    ) {
      // Se temos slides regenerados e estamos no conteúdo que foi regenerado,
      // usar os slides regenerados
      if (regeneratedSlides && currentSlideIndex >= 3) {
        setSlideData(regeneratedSlides[currentSlideIndex]);
      } else {
        setSlideData(currentContentSlides[currentSlideIndex]);
      }
    }
  }, [currentSlideIndex, currentContentSlides, regeneratedSlides]);

  // Avançar para o próximo slide
  const nextSlide = () => {
    // Verificar se estamos em um quiz
    if (
      (slideData?.tipo === "quiz" ||
        slideData?.tipo === "quiz_diagnostico" ||
        slideData?.tipo === "quiz_avaliativo") &&
      quizNextRef.current
    ) {
      // Tentativa de navegar dentro do quiz
      const navigatedInQuiz = quizNextRef.current();

      // Se não navegou dentro do quiz, só então avança para o próximo slide
      if (!navigatedInQuiz && currentSlideIndex < totalSlides - 1) {
        setCurrentSlideIndex(currentSlideIndex + 1);
      }
    }
    // Verificar se é o último slide deste conteúdo
    else if (currentSlideIndex === totalSlides - 1) {
      // Mostrar tela de conclusão do conteúdo
      setShowContentCompletion(true);
    }
    // Caso não seja um quiz nem o último slide, comportamento normal
    else if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    }
  };

  // Voltar para o slide anterior
  const prevSlide = () => {
    // Verificar se estamos em um quiz
    if (
      (slideData?.tipo === "quiz" ||
        slideData?.tipo === "quiz_diagnostico" ||
        slideData?.tipo === "quiz_avaliativo") &&
      quizPrevRef.current
    ) {
      // Tentativa de navegar dentro do quiz
      const navigatedInQuiz = quizPrevRef.current();

      // Se não navegou dentro do quiz, só então volta para o slide anterior
      if (!navigatedInQuiz && currentSlideIndex > 0) {
        setCurrentSlideIndex(currentSlideIndex - 1);
      }
    }
    // Se estamos na tela de conclusão, voltar para o último slide
    else if (showContentCompletion) {
      setShowContentCompletion(false);
      setCurrentSlideIndex(totalSlides - 1);
    }
    // Caso não seja um quiz, comportamento normal
    else if (currentSlideIndex > 0) {
      setCurrentSlideIndex(currentSlideIndex - 1);
    }
  };

  // Modificar a função goToNextContent para salvar o progresso do módulo
  const goToNextContent = async () => {
    // Salvar progresso do conteúdo atual como concluído
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString || '{}');

      if (user.id) {
        const currentContentItem = contentItems[currentContentIndex];

        if (currentContentItem && currentContentItem.id) {
          await api.saveUserProgress({
            user_id: user.id,
            course_id: courseId,
            content_id: currentContentItem.id,
            completed: true
          });
          console.log(`Conteúdo ${currentContentIndex + 1} marcado como concluído`);
        }
      }
    } catch (error) {
      console.error("Erro ao salvar progresso do conteúdo:", error);
    }

    // Verificar se há mais conteúdo
    if (currentContentIndex < contentItems.length - 1) {
      const nextContentIndex = currentContentIndex + 1;
      setCurrentContentIndex(nextContentIndex);
      loadContentSlides(contentItems, nextContentIndex);
    } else {
      // Este é o último conteúdo da trilha, mostrar conclusão da trilha
      setShowCourseCompletion(true);
    }
  };

  const skipToNextContent = () => {
    // Fechar a notificação antes de avançar
    setShowSkipNotification(false);

    // Verificar se há mais conteúdo
    if (currentContentIndex < contentItems.length - 1) {
      const nextContentIndex = currentContentIndex + 1;
      setCurrentContentIndex(nextContentIndex);
      loadContentSlides(contentItems, nextContentIndex);
    } else {
      // Este é o último conteúdo da trilha, mostrar conclusão da trilha
      setShowCourseCompletion(true);
    }
  };

  // Voltar para o painel inicial
  const backToDashboard = () => {
    navigate("/professor"); // Ajuste conforme sua rota de painel
  };

  const handleQuizComplete = async (score, total) => {
    setQuizScore({ score, total });
  
    // Calcular percentual do score
    const scorePercentage = Math.round((score / total) * 100);
  
    // Armazenar resultado do quiz
    const quizResults = JSON.parse(localStorage.getItem("quizResults") || "{}");
    quizResults[`${courseId}-${currentContentIndex}-${currentSlideIndex}`] = {
      score,
      total,
      timestamp: new Date().toISOString(),
    };
    localStorage.setItem("quizResults", JSON.stringify(quizResults));
  
    try {
      const userString = localStorage.getItem('user');
      const user = JSON.parse(userString || '{}');
  
      if (user.id) {
        const currentContentItem = contentItems[currentContentIndex];
  
        if (currentContentItem && currentContentItem.id) {
          const isAvaliativo = slideData?.tipo === "quiz_avaliativo";
          const isDiagnostic = slideData?.tipo === "quiz_diagnostico";
          const isLastOrNearLast = currentSlideIndex >= totalSlides - 2;
  
          // Verificar scores para ambos os tipos de quiz
          const highScoreDiagnostic = isDiagnostic && scorePercentage >= 80;
          const passingScoreAvaliativo = isAvaliativo && scorePercentage >= 60;
  
          await api.saveUserProgress({
            user_id: user.id,
            course_id: courseId,
            content_id: currentContentItem.id,
            // Marcar como completo se for avaliativo com score >=60 OU diagnóstico com score alto
            completed: (isAvaliativo && passingScoreAvaliativo) || highScoreDiagnostic,
            score: scorePercentage,
            quiz_type: slideData?.tipo,
            lastSlideIndex: currentSlideIndex,
            hasCompletedDiagnosticQuiz: isDiagnostic || false,
            lastAccess: new Date().toISOString()
          });
  
          // Para quiz diagnóstico com score alto
          if (isDiagnostic && currentSlideIndex === 2 && scorePercentage >= 80) {
            setShowSkipNotification(true);
            return; // Sair da função
          }
  
          // Para quiz avaliativo com score >= 60
          if (isAvaliativo && scorePercentage >= 60) {
            setShowSkipNotification(true);
            return; // Sair da função
          }
  
          // Para quiz avaliativo com score < 60
          if (isAvaliativo && scorePercentage < 60) {
            // Iniciar processo de regeneração do conteúdo
            setRegeneratingContent(true);
            try {
              // Preparar contexto para regeneração
              const context = {
                title: currentContentItem.title,
                description: currentContentItem.description,
                content: currentContentItem.content,
                learning_objectives: currentContentItem.learning_objectives || [],
                related_objectives: currentContentItem.related_objectives || [],
                score_percentage: scorePercentage // Incluir a pontuação para contexto
              };
              
              // Chamar função para regenerar o conteúdo
              const newSlides = await api.regenerateContentSlides(context);
              
              if (newSlides && newSlides.slides) {
                setRegeneratedSlides(newSlides.slides);
                // Redirecionar para o slide 3 (quarto slide)
                setCurrentSlideIndex(3);
              } else {
                // Se não conseguiu gerar novos slides, apenas redirecionar
                setCurrentSlideIndex(3);
              }
            } catch (error) {
              console.error("Erro ao regenerar conteúdo:", error);
              // Em caso de falha, apenas redirecionar sem regenerar
              setCurrentSlideIndex(3);
            } finally {
              setRegeneratingContent(false);
            }
            return; // Sair da função
          }
        }
      }
    } catch (error) {
      console.error("Erro ao salvar progresso do quiz:", error);
    }
  
    // Comportamento padrão (para os casos que não têm tratamento especial acima)
    if (currentSlideIndex < totalSlides - 1) {
      setCurrentSlideIndex(currentSlideIndex + 1);
    } else {
      setShowContentCompletion(true);
    }
  };
  

  // Exemplo de implementação em um componente de slides
  const markContentAsComplete = async () => {
    const userString = localStorage.getItem('user');
    const user = JSON.parse(userString || '{}');

    if (user.id) {
      await api.saveUserProgress({
        user_id: user.id,
        course_id: courseId,
        content_id: currentContentItem.id,
        completed: true
      });
    }
  };

  // Renderiza o conteúdo do slide com base no tipo
  const renderSlideContent = () => {
    // Mostrar tela de carregamento durante regeneração
    if (regeneratingContent) {
      return (
        <div className="regenerating-content">
          <div className="regenerating-animation">
            <div className="loading-spinner"></div>
          </div>
          <h2>Adaptando o conteúdo para você...</h2>
          <p>
            Baseado no seu desempenho no quiz (nota {Math.round((quizScore.score / quizScore.total) * 100)}%), 
            estamos preparando uma nova abordagem do conteúdo com explicações alternativas 
            para ajudar no seu aprendizado.
          </p>
          <p className="regenerating-wait">
            Por favor, aguarde alguns instantes.
          </p>
        </div>
      );
    }

    if (showCourseCompletion) {
      return (
        <ConclusaoSlide
          titulo="Parabéns! Você completou esta trilha!"
          mensagem={`Você concluiu com sucesso todos os conteúdos da trilha "${trilhaData?.titulo}".`}
          quizScore={quizScore}
          onComplete={backToDashboard}
        />
      );
    }

    if (showSkipNotification) {
      const contentTitle = contentItems[currentContentIndex]?.title || "este conteúdo";
      const scoreDisplay = Math.round((quizScore.score / quizScore.total) * 100);

      // Verificar se é um quiz diagnóstico ou avaliativo
      const isDiagnostic = slideData?.tipo === "quiz_diagnostico";

      return (
        <ConclusaoSlide
          titulo={isDiagnostic ? "Conteúdo Avançado!" : "Quiz Avaliativo Aprovado!"}
          mensagem={
            isDiagnostic
              ? `Você demonstrou um excelente conhecimento no quiz diagnóstico (nota ${scoreDisplay}%). O conteúdo "${contentTitle}" será marcado como concluído e você avançará para o próximo módulo.`
              : `Parabéns! Você atingiu ${scoreDisplay}% de acertos no quiz avaliativo. O conteúdo "${contentTitle}" foi concluído com sucesso e você pode avançar para o próximo módulo.`
          }
          quizScore={quizScore}
          onComplete={skipToNextContent}
          buttonText="Avançar para o Próximo Conteúdo"
        />
      );
    }

    if (showContentCompletion) {
      const isLastContent = currentContentIndex === contentItems.length - 1;
      const contentTitle =
        contentItems[currentContentIndex]?.title || "este conteúdo";

      return (
        <ConclusaoSlide
          titulo={`Conteúdo Concluído!`}
          mensagem={`Você completou "${contentTitle}".`}
          quizScore={quizScore}
          onComplete={isLastContent ? goToNextContent : goToNextContent}
          buttonText={isLastContent ? "Finalizar Trilha" : "Próximo Conteúdo"}
        />
      );
    }

    if (!slideData) return <div>Carregando...</div>;

    switch (slideData.tipo) {
      case "problema":
        return (
          <TextoSlide titulo={slideData.titulo} conteudo={slideData.conteudo} />
        );
      case "objetivos":
        return (
          <TopicosSlide
            titulo={slideData.titulo}
            topicos={slideData.objetivos}
          />
        );
      case "quiz_diagnostico":
      case "quiz_avaliativo":
      case "quiz":
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

  const regenerateContentSlides = async (contentItem) => {
    try {
      // Extrair slides relevantes (do quarto slide até o quiz avaliativo)
      const startIndex = 3; // Índice do quarto slide
      const endIndex = currentContentSlides.findIndex(slide => 
        slide.tipo === "quiz_avaliativo"
      );
      
      // Se não encontrou o quiz avaliativo ou o índice de início é inválido
      if (endIndex === -1 || startIndex >= currentContentSlides.length) {
        console.warn("Não foi possível identificar os slides a regenerar");
        return null;
      }
      
      const slidesToRegenerate = currentContentSlides.slice(startIndex, endIndex);
      
      // Obter informações sobre o conteúdo para contexto
      const context = {
        title: contentItem.title,
        description: contentItem.description,
        content: contentItem.content,
        original_slides: slidesToRegenerate,
        learning_objectives: contentItem.learning_objectives || []
      };
      
      // Chamar a API para regenerar o conteúdo
      const result = await api.regenerateContentSlides(context);
      
      if (!result || !result.slides || !Array.isArray(result.slides)) {
        console.warn("API retornou formato inválido para os slides regenerados");
        return null;
      }
      
      // Criar uma cópia dos slides atuais
      const newSlides = [...currentContentSlides];
      
      // Substituir apenas os slides entre o quarto slide e o quiz avaliativo
      for (let i = 0; i < result.slides.length; i++) {
        const targetIndex = startIndex + i;
        // Só substituir se o índice for válido e não for o quiz
        if (targetIndex < endIndex && targetIndex < newSlides.length) {
          newSlides[targetIndex] = result.slides[i];
        }
      }
      
      return newSlides;
    } catch (error) {
      console.error("Erro ao regenerar conteúdo:", error);
      throw error;
    }
  };

  // Verificar se o botão próximo deve estar desabilitado
  const isNextButtonDisabled = () => {
    // No último slide do último conteúdo com a tela de conclusão da trilha
    if (showCourseCompletion) {
      return true;
    }

    // Na tela de conclusão do conteúdo
    if (showContentCompletion) {
      return false; // Nunca desabilitar na tela de conclusão
    }

    // Em um quiz, verificar se pode avançar
    if (
      (slideData?.tipo === "quiz" ||
        slideData?.tipo === "quiz_diagnostico" ||
        slideData?.tipo === "quiz_avaliativo") &&
      quizNextRef.current
    ) {
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
                {trilhaData?.titulo || "Nome da Trilha"} - Conteúdo{" "}
                {currentContentIndex + 1}/{contentItems.length}
              </h3>
            </div>
            <div className="slide-content-block">{renderSlideContent()}</div>
          </div>

          {/* Não mostrar botões de navegação durante quiz, conclusão de conteúdo ou trilha */}
          {!showCourseCompletion &&
            !showSkipNotification &&
            slideData?.tipo !== "quiz_diagnostico" &&
            slideData?.tipo !== "quiz_avaliativo" &&
            slideData?.tipo !== "quiz" && (
              <>
                <button
                  className="nav-button prev"
                  onClick={prevSlide}
                  disabled={currentSlideIndex === 0 && !showContentCompletion}
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

                {!showContentCompletion && (
                  <div className="slide-indicator">
                    {currentSlideIndex + 1} / {totalSlides}
                  </div>
                )}
              </>
            )}
        </>
      )}
    </div>
  );
};

export default SlidesPage;
