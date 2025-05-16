import React, { useState, useEffect } from "react";
import "./styles/ContinueLearning.css";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import {
  PiStudent,
  PiMathOperations,
  PiAtom,
  PiBooks,
  PiCode,
  PiFlask,
  PiChalkboardTeacher,
  PiPencil,
  PiGlobe,
  PiRobot,
  PiMicroscope,
  PiPaintBrush,
} from "react-icons/pi";

const ContinueLearning = () => {
  const [lastCourse, setLastCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [creator, setCreator] = useState(null);
  const navigate = useNavigate();

  // Mapeamento de ícones disponíveis
  const iconComponents = {
    PiStudent,
    PiMathOperations,
    PiAtom,
    PiBooks,
    PiCode,
    PiFlask,
    PiChalkboardTeacher,
    PiPencil,
    PiGlobe,
    PiRobot,
    PiMicroscope,
    PiPaintBrush,
  };

  useEffect(() => {
    const fetchLastCourse = async () => {
      try {
        // Obter o usuário do localStorage
        const userString = localStorage.getItem("user");
        if (!userString) return;

        const user = JSON.parse(userString);

        // Buscar progresso do usuário
        const userProgress = await api.getUserProgress(user.id);

        if (!userProgress || Object.keys(userProgress).length === 0) {
          setLoading(false);
          return;
        }

        // Encontrar o curso com o timestamp de acesso mais recente
        let lastAccessedCourseId = null;
        let lastAccessedTimestamp = 0;

        Object.entries(userProgress).forEach(([courseId, data]) => {
          if (data.lastAccessed && data.lastAccessed > lastAccessedTimestamp) {
            lastAccessedTimestamp = data.lastAccessed;
            lastAccessedCourseId = courseId;
          }
        });

        if (lastAccessedCourseId) {
          // Buscar detalhes do curso
          const courseData = await api.getCourseById(lastAccessedCourseId);

          if (courseData) {
            // Obter o número total de itens do curso
            const totalCourseItems = courseData.steps && courseData.steps.content && 
                                    courseData.steps.content.content_items ? 
                                    courseData.steps.content.content_items.length : 0;
            
            // Calcular progresso do curso
            const courseProgress = userProgress[lastAccessedCourseId];
            const items = courseProgress.items || {};
            
            // Contar itens concluídos
            const completedItems = Object.values(items).filter(item => item.completed).length;
            
            // Calcular porcentagem de progresso baseado no total de itens do curso
            const progressPercent = totalCourseItems > 0 ? (completedItems / totalCourseItems) * 100 : 0;
            
            setLastCourse({
              id: lastAccessedCourseId,
              title: courseData.title || "Curso sem título",
              description: courseData.description || "Sem descrição",
              icon: courseData.icon || "PiStudent",
              created_by: courseData.created_by
            });
            
            setProgress(progressPercent);

            // Buscar informações do criador do curso
            if (courseData.created_by) {
              const userData = await api.getUserById(courseData.created_by);
              if (userData) {
                setCreator({
                  name: userData.username || "Usuário",
                  role: userData.role === "teacher" ? "Professor" : "Administrador"
                });
              }
            }
          }
        }
      } catch (error) {
        console.error("Erro ao buscar último curso acessado:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLastCourse();
  }, []);

  const handleContinueCourse = async () => {
    if (lastCourse && lastCourse.id) {
      try {
        // Obter o usuário do localStorage
        const userString = localStorage.getItem("user");
        if (userString) {
          const user = JSON.parse(userString);
          // Atualizar o timestamp de último acesso
          await api.updateCourseLastAccessed(user.id, lastCourse.id);
        }
      } catch (error) {
        console.error("Erro ao atualizar timestamp de acesso:", error);
      }
      
      // Navegar para o curso
      navigate(`/slides/${lastCourse.id}/1`);
    }
  };

  if (loading) {
    return (
      <div className="continue-learning-container">
        <div className="continue-learning-header">
          <h2>Continue Aprendendo</h2>
        </div>
        <div className="current-course-card loading">
          <p>Carregando seu último curso...</p>
        </div>
      </div>
    );
  }

  if (!lastCourse) {
    return (
      <div className="continue-learning-container">
        <div className="continue-learning-header">
          <h2>Continue Aprendendo</h2>
        </div>
        <div className="current-course-card no-course">
          <p>Você ainda não acessou nenhum curso</p>
        </div>
      </div>
    );
  }

  // Obter o componente de ícone correspondente
  const IconComponent = iconComponents[lastCourse.icon] || iconComponents.PiStudent;

  return (
    <div className="continue-learning-container">
      <div className="continue-learning-header">
        <h2>Continue Aprendendo</h2>
      </div>

      <div className="current-course-card" onClick={handleContinueCourse} style={{ cursor: 'pointer' }}>
        <div className="course-image-container">
          <div className="engineering-icon-container">
            <IconComponent className="engineering-icon" />
          </div>
        </div>
        <div className="course-info">
          <h3>{lastCourse.title}</h3>
          <p className="instructor">
            {creator ? `${creator.name} | ${creator.role}` : "Clique para continuar"}
          </p>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
          <p className="time-remaining">{Math.round(progress)}% concluído</p>
        </div>
      </div>
    </div>
  );
};

export default ContinueLearning;