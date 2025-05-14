import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import codefolioImg from "../../assets/codefolio.png";
import "./styles/TrilhaCard.css";
import api from "../../services/api";
import TrilhaDetails from "./TrilhaDetails";
import TrilhaEdit from "./TrilhaEdit";

const TrilhaCard = ({ trilha, isProfessorView = false, onCourseUpdate }) => {
  const { id, title, status, description, created_by } = trilha;
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProgress = async () => {
      try {
        const userString = localStorage.getItem("user");
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
        const userData = await api.getUserById(created_by);
        if (userData) {
          setCreator({
            name: userData.username || "Usuário",
            role: userData.role === "teacher" ? "Professor" : "Administrador",
            avatar:
              userData.avatar ||
              `https://ui-avatars.com/api/?name=${userData.username}&background=random`,
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
    navigate(`/slides/${id}/1`);
  };

  // Função para mostrar/ocultar os detalhes
  const handleShowDetails = () => {
    setShowDetails(true);
  };

  // Função para lidar com edição do curso
  const handleEditCourse = () => {
    setShowEdit(true);
  };

  // Função para lidar com atualizações do curso
  const handleCourseUpdate = (updatedTrilha) => {
    if (onCourseUpdate) {
      onCourseUpdate(updatedTrilha);
    }
  };

  const statusColor = status === "concluido" ? "green" : "yellow";

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
          {/* Condicionar a exibição do StatusBadge apenas quando NÃO for visualização do professor */}
          {!isProfessorView && (
            <StatusBadge status={status || "em andamento"} />
          )}
        </div>

        <p className="trilha-description">
          {description || "Sem descrição disponível"}
        </p>

        <div className="trilha-actions">
          <button className="trilha-button" onClick={handleAccessTrilha}>
            Acessar
          </button>
          {isProfessorView ? (
            <button
              className="trilha-button details"
              onClick={handleEditCourse}
            >
              Editar
            </button>
          ) : (
            <button
              className="trilha-button details"
              onClick={handleShowDetails}
            >
              Detalhes
            </button>
          )}
        </div>
      </div>

      {showDetails && (
        <TrilhaDetails trilha={trilha} onClose={() => setShowDetails(false)} />
      )}

      {showEdit && (
        <TrilhaEdit
          trilha={trilha}
          onClose={() => setShowEdit(false)}
          onUpdate={handleCourseUpdate}
        />
      )}
    </>
  );
};

export default TrilhaCard;
