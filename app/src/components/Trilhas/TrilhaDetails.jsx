import React, { useState, useEffect } from "react";
import { FaLock, FaChevronDown, FaChevronUp, FaCheckCircle, FaClock, FaTimes } from "react-icons/fa";
import api from "../../services/api";
import "./styles/TrilhaDetails.css";

const TrilhaDetails = ({ trilha, onClose }) => {
  const [contentItems, setContentItems] = useState([]);
  const [userProgress, setUserProgress] = useState({});
  const [loading, setLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState({});

  useEffect(() => {
    const fetchTrilhaDetails = async () => {
      try {
        setLoading(true);
        
        // Buscar detalhes do curso
        const courseData = await api.getCourseById(trilha.id);
        
        // Buscar progresso do usuário
        const userString = localStorage.getItem('user');
        const user = userString ? JSON.parse(userString) : { id: null };
        
        if (user.id && courseData) {
          const progressData = await api.getUserProgressByCourse(user.id, trilha.id);
          setUserProgress(progressData || {});
        }
        
        // Organizar conteúdos
        if (courseData?.steps?.content?.content_items) {
          setContentItems(courseData.steps.content.content_items);
        }
      } catch (error) {
        console.error("Erro ao buscar detalhes da trilha:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTrilhaDetails();
  }, [trilha.id]);
  
  const toggleSection = (index) => {
    setExpandedSections(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };
  
  // Calcular progresso geral
  const calculateOverallProgress = () => {
    if (!contentItems.length) return 0;
    const completedItems = contentItems.filter(item => 
      userProgress[item.id]?.completed
    ).length;
    return Math.round((completedItems / contentItems.length) * 100);
  };

  return (
    <div className="trilha-details-overlay">
      <div className="trilha-details-container">
        <div className="trilha-details-header">
          <h2>Visão Geral da Trilha</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="trilha-details-content">
          <div className="trilha-meta">
            <h3>{trilha.title}</h3>
            <div className="trilha-progress-container">
              <div className="trilha-progress-bar">
                <div 
                  className="trilha-progress-fill" 
                  style={{ width: `${calculateOverallProgress()}%` }}
                ></div>
              </div>
              <span className="trilha-progress-text">{calculateOverallProgress()}% concluído</span>
            </div>
          </div>
          
          <div className="trilha-content-list">
            <h4>Conteúdos da trilha</h4>
            
            {loading ? (
              <div className="loading-message">Carregando conteúdos...</div>
            ) : contentItems.length === 0 ? (
              <div className="empty-message">Esta trilha não possui conteúdos disponíveis.</div>
            ) : (
              <ul className="content-sections">
                {contentItems.map((item, index) => (
                  <li key={item.id || index} className="content-section">
                    <div 
                      className="section-header" 
                      onClick={() => toggleSection(index)}
                    >
                      <div className="section-title">
                        <span className="section-status">
                          {userProgress[item.id]?.completed ? (
                            <FaCheckCircle className="status-icon complete" /> 
                          ) : userProgress[item.id]?.lastAccess ? (
                            <FaClock className="status-icon pending" />
                          ) : (
                            <FaLock className="status-icon not-accessed" />
                          )}
                        </span>
                        <span>{item.title || `Conteúdo ${index + 1}`}</span>
                      </div>
                      <button className="expand-button">
                        {expandedSections[index] ? <FaChevronUp /> : <FaChevronDown />}
                      </button>
                    </div>
                    
                    {expandedSections[index] && (
                      <div className="section-details">
                        <p>{item.description || "Nenhuma descrição disponível."}</p>
                        {item.slides && (
                          <div className="slide-count">
                            {item.slides.length} slides
                          </div>
                        )}
                        {userProgress[item.id]?.lastAccess && (
                          <div className="last-access">
                            Último acesso: {
                              // Verificar se é string ISO ou timestamp numérico
                              typeof userProgress[item.id].lastAccess === 'string' 
                                ? new Date(userProgress[item.id].lastAccess).toLocaleDateString() 
                                : new Date(userProgress[item.id].lastAccess * 1000).toLocaleDateString()
                            }
                          </div>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
        
        <div className="trilha-details-footer">
          <button className="trilha-button" onClick={onClose}>Fechar</button>
        </div>
      </div>
    </div>
  );
};

export default TrilhaDetails;