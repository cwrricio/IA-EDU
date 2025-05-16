import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./professor.css";
import Sidebar from "../../components/sidebar/Sidebar";
import TrilhaCard from "../../components/Trilhas/TrilhaCard";
import api from "../../services/api";

const ProfessorPage = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  // Buscar cursos do professor ao montar o componente
  useEffect(() => {
    const fetchProfessorCourses = async () => {
      try {
        setLoading(true);
        // Obter o usuário do localStorage
        const userString = localStorage.getItem("user");
        if (!userString) {
          navigate("/login"); // Redirecionar para login se não houver usuário
          return;
        }

        const user = JSON.parse(userString);
        // Chamar a API para buscar cursos deste professor
        const result = await api.getCoursesByProfessor(user.id);

        if (result && result.courses) {
          // Transformar os dados do formato de objeto para array
          const coursesArray = Object.entries(result.courses).map(
            ([id, data]) => ({
              id,
              title: data.title,
              status: data.status || "em andamento",
              date: formatDate(data.created_at),
              description: data.description || "Descrição não disponível",
              created_by: data.created_by || "1",
              icon: data.icon || "PiStudent",
            })
          );

          setCourses(coursesArray);
        }
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setError(
          "Não foi possível carregar os cursos. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProfessorCourses();
  }, [navigate]);

  // Função auxiliar para formatar datas
  const formatDate = (timestamp) => {
    if (!timestamp) return "Data desconhecida";

    // Se timestamp é número, converter para objeto Date
    const date =
      typeof timestamp === "number"
        ? new Date(timestamp * 1000) // Converter de Unix timestamp para Date
        : new Date(timestamp); // Já é string de data

    return `Atualizado em ${date.toLocaleDateString("pt-BR")}`;
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleFilterSelect = (type) => {
    setFilterType(type);
    setDropdownOpen(false);
  };

  // Função para redirecionar para a página de upload
  const redirectToUpload = () => {
    navigate("/upload");
  };

  // Filtrar cursos com base no critério de filtro
  const filteredCourses =
    filterType === "all"
      ? courses
      : courses.filter((course) => course.status === filterType);

  // Função para atualizar a lista de cursos
  const handleCourseUpdate = (updatedCourse) => {
    // Atualizar a lista de cursos com o curso atualizado
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id
          ? { ...course, ...updatedCourse }
          : course
      )
    );
  };

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="professor-container">
          <div className="professor-header">
            <h1 className="professor-title">Minhas Trilhas</h1>

            <div className="professor-actions">

              <button className="nova-trilha-btn" onClick={redirectToUpload}>
                Nova Trilha
              </button>
            </div>
          </div>

          {loading ? (
            <div className="loading-message">Carregando trilhas...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : filteredCourses.length === 0 ? (
            <div className="empty-state">
              <p>Nenhuma trilha encontrada.</p>
              <button className="nova-trilha-btn" onClick={redirectToUpload}>
                Criar sua primeira trilha
              </button>
            </div>
          ) : (
            <div className="trilhas-grid">
              {filteredCourses.map((course) => (
                <TrilhaCard
                  key={course.id}
                  trilha={course}
                  isProfessorView={true} // Essa propriedade está correta
                  onCourseUpdate={handleCourseUpdate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessorPage;
