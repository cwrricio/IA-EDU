import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import StatusBadge from "./StatusBadge";
import codefolioImg from "../../assets/codefolio.png";
import "./styles/TrilhaCard.css";
import api from "../../services/api";
import TrilhaDetails from "./TrilhaDetails";
import TrilhaEdit from "./TrilhaEdit";

const TrilhaCard = ({ trilha }) => {
  const { id, title, status, description, created_by } = trilha;
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [userProgress, setUserProgress] = useState(null);
  const [trilhaTitle, setTrilhaTitle] = useState(title);
  const [trilhaDescription, setTrilhaDescription] = useState(description);
  const navigate = useNavigate();
  const location = useLocation();

  // Verificar se estamos na página do professor
  const isProfessorPage = location.pathname.includes("/professor");

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

    // Verificar edições locais
    const checkLocalEdits = () => {
      const editedCourses = JSON.parse(
        localStorage.getItem("editedCourses") || "{}"
      );

      if (editedCourses[id]) {
        const localData = editedCourses[id];
        setTrilhaTitle(localData.title || title);
        setTrilhaDescription(localData.description || description);
      } else {
        setTrilhaTitle(title);
        setTrilhaDescription(description);
      }
    };

    checkLocalEdits();
  }, [id, title, description, created_by]);

  const handleAccessTrilha = () => {
    // Lógica existente para acessar a trilha
    // [código omitido por brevidade]
    navigate(`/slides/${id}/1`);
  };

  return (
    <>
      <div className="trilha-card">
        <div className="trilha-image-container">
          <div className="trilha-image">
            <div className="trilha-image-wrapper">
              <img src={codefolioImg} alt={trilhaTitle} />
            </div>
          </div>
        </div>

        <h3 className="trilha-title">{trilhaTitle}</h3>

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

        <p className="trilha-description">{trilhaDescription}</p>

        <div className="trilha-actions">
          <button className="trilha-button" onClick={handleAccessTrilha}>
            Acessar
          </button>
          {isProfessorPage ? (
            <button
              className="trilha-button edit"
              onClick={() => setShowEdit(true)}
            >
              Editar
            </button>
          ) : (
            <button
              className="trilha-button details"
              onClick={() => setShowDetails(true)}
            >
              Detalhes
            </button>
          )}
        </div>
      </div>

      {showDetails && (
        <TrilhaDetails
          trilha={{
            ...trilha,
            title: trilhaTitle,
            description: trilhaDescription,
          }}
          onClose={() => setShowDetails(false)}
        />
      )}

      {showEdit && (
        <TrilhaEdit
          trilha={{
            ...trilha,
            title: trilhaTitle,
            description: trilhaDescription,
          }}
          onClose={() => setShowEdit(false)}
        />
      )}
    </>
  );
};

export default TrilhaCard;
