import React, { useState, useEffect } from "react";
import StatusBadge from "./StatusBadge";
import codefolioImg from "../../assets/codefolio.png";
import "./styles/TrilhaCard.css";
import api from "../../services/api";

const TrilhaCard = ({ trilha }) => {
  const { id, title, status, description, created_by } = trilha;
  const [creator, setCreator] = useState(null);
  const [loading, setLoading] = useState(false);

  // Fetch creator information when component mounts
  useEffect(() => {
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
  }, [created_by]);

  return (
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
        <button className="trilha-button">
          {status === "concluido" ? "Ver detalhes" : "Editar"}
        </button>
      </div>
    </div>
  );
};

export default TrilhaCard;
