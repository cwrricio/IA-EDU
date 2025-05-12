import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import codefolioImg from "../../assets/codefolio.png";
import "./styles/TrilhaCard.css";
import api from "../../services/api";
import TrilhaDetails from "./TrilhaDetails";

const TrilhaCard = ({ trilha }) => {
  const { id, title, status, description, created_by } = trilha;
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const navigate = useNavigate();

  // Buscar progresso do usuário ao carregar o componente
  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const userString = localStorage.getItem('user');
        if (!userString) return;
        
        const user = JSON.parse(userString);
        const progress = await api.getUserProgress(user.id, id);
        setUserProgress(progress);
      } catch (error) {
        console.error("Erro ao buscar progresso do usuário:", error);
      }
    };
    
    fetchUserProgress();
    
    // Buscar informações do criador do curso
    const fetchCreatorInfo = async () => {
      if (!created_by) return;
      
      try {
        setLoading(true);
        // Use the database structure to get user data
        // You'll need to implement this method in your API service
        const userData = await api.getUserById(created_by);
        if (userData) {
          setCreator({
            name: userData.username || "Usuário",
            role: userData.role === "teacher" ? "Professor" : "Administrador",
            avatar: userData.avatar || `https://ui-avatars.com/api/?name=${userData.username}&background=random`
          });
        }
      } catch (error) {
        console.error("Error fetching creator information:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCreatorInfo();
  }, [id, created_by]);

  // Função para navegar para a página de slides
  const handleAccessTrilha = () => {
    // Se não houver progresso para o curso, direcione para o início do curso
    if (!userProgress || Object.keys(userProgress).length === 0) {
      console.log("Sem progresso, indo para o início");
      navigate(`/slides/${id}/1`);
      return;
    }
    
    // Encontrar o último conteúdo acessado e seu progresso
    let lastAccessedItemId = null;
    let lastAccessTime = 0;
    
    Object.entries(userProgress).forEach(([itemId, data]) => {
      if (data.lastAccess && data.lastAccess > lastAccessTime) {
        lastAccessTime = data.lastAccess;
        lastAccessedItemId = itemId;
      }
    });
    
    if (!lastAccessedItemId) {
      console.log("Não foi possível determinar o último item, indo para o início");
      navigate(`/slides/${id}/1`);
      return;
    }
    
    // Obter dados do último conteúdo acessado
    const itemProgress = userProgress[lastAccessedItemId];
    console.log("Progresso encontrado:", itemProgress);
    
    // CASO 1: Conteúdo está marcado como completo
    if (itemProgress.completed === true) {
      // Calcular o ID do próximo conteúdo
      const nextContentId = parseInt(lastAccessedItemId) + 1;
      
      // Se o próximo conteúdo existe ou está dentro do limite esperado
      if (userProgress[nextContentId.toString()] || nextContentId <= 5) {
        console.log(`Conteúdo ${lastAccessedItemId} completo, indo para o próximo: ${nextContentId}`);
        navigate(`/slides/${id}/${nextContentId}`);
      } else {
        console.log(`Conteúdo ${lastAccessedItemId} completo, mas não há próximo. Indo para o início deste mesmo conteúdo`);
        navigate(`/slides/${id}/${lastAccessedItemId}?slide=0`);
      }
      return;
    }
    
    // CASO 2: Conteúdo não completo, mas tem score (passou pelo quiz diagnóstico)
    if (itemProgress.score !== undefined) {
      console.log(`Conteúdo ${lastAccessedItemId} tem score ${itemProgress.score}, indo para o slide após o quiz (slide 3)`);
      
      // Alteração aqui - Vamos adicionar um estado no sessionStorage para garantir
      // que o slide correto seja usado mesmo que a validação de tamanho falhe
      sessionStorage.setItem('forceInitialSlide', '3');
      
      // Mantemos a URL como estava
      navigate(`/slides/${id}/${lastAccessedItemId}?slide=3`);
      return;
    }
    
    // CASO 3: Conteúdo não completo e não fez quiz diagnóstico
    const lastSlideIndex = itemProgress.lastSlideIndex || 0;
    console.log(`Conteúdo ${lastAccessedItemId} sem quiz completado, indo para o slide ${lastSlideIndex}`);
    navigate(`/slides/${id}/${lastAccessedItemId}?slide=${lastSlideIndex}`);
  };

  // Função para mostrar/ocultar os detalhes
  const handleShowDetails = () => {
    setShowDetails(true);
  };

  return (
    <>
      <div className="trilha-card">
        <div className="trilha-image-container">
          <div className="trilha-image">
            <div className="trilha-image-wrapper">
              <img src={codefolioImg} alt={title} />
            </div>
          </div>
        </div>

        <h3 className="trilha-title">{title}</h3>

        <div className="trilha-info">
          {loading ? (
            <div className="instructor-info">
              <div className="instructor-details">
                <div className="instructor-name">Carregando...</div>
              </div>
            </div>
          ) : creator ? (
            <div className="instructor-info">
              <div className="instructor-avatar">
                <img src={creator.avatar} alt={creator.name} />
              </div>
              <div className="instructor-details">
                <div className="instructor-name">{creator.name}</div>
                <div className="instructor-role">{creator.role}</div>
              </div>
            </div>
          ) : (
            <div className="instructor-info">
              <div className="instructor-details">
                <div className="instructor-name">Criador desconhecido</div>
              </div>
            </div>
          )}
          <StatusBadge status={status || "em andamento"} />
        </div>

        <p className="trilha-description">{description || "Sem descrição disponível"}</p>

        <div className="trilha-actions">
          <button className="trilha-button" onClick={handleAccessTrilha}>
            Acessar
          </button>
          <button className="trilha-button details" onClick={handleShowDetails}>
            Detalhes
          </button>
        </div>
      </div>
      
      {showDetails && (
        <TrilhaDetails 
          trilha={trilha} 
          onClose={() => setShowDetails(false)} 
        />
      )}
    </>
  );
};

export default TrilhaCard;
