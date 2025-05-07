import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
import TrilhasHeader from "./TrilhasHeader";
import TrilhasCarousel from "./TrilhasCarousel";
import "./styles/Trilhas.css";
import ContinueLearning from "./ContinueLearning";
import QuadradoDaTrilha from "./QuadradoDaTrilha";

const Trilhas = () => {
  // Adicionar estado para filtrar trilhas
  const [filtro, setFiltro] = useState("all");
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState([]);
  const [error, setError] = useState(null);

  // Buscar todos os cursos
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        // Obter o usuário do localStorage
        const userString = localStorage.getItem('user');
        if (!userString) {
          navigate('/login'); // Redirecionar para login se não houver usuário
          return;
        }

        // Chamar a API para buscar os cursos
        const result = await api.getAllCourses();

        if (result && result.courses) {
          // Transformar os dados do formato de objeto para array
          const coursesArray = Object.entries(result.courses).map(([id, data]) => ({
            id,
            title: data.title,
            status: data.status || "em andamento",
            date: formatDate(data.created_at),
            description: data.description || "Descrição não disponível",
            created_by: data.created_by || "1"
          }));

          setCourses(coursesArray);
        }
      } catch (err) {
        console.error("Erro ao buscar cursos:", err);
        setError("Não foi possível carregar os cursos. Tente novamente mais tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  const formatDate = (timestamp) => {
    if (!timestamp) return "Data desconhecida";

    // Se timestamp é número, converter para objeto Date
    const date = typeof timestamp === 'number'
      ? new Date(timestamp * 1000)  // Converter de Unix timestamp para Date
      : new Date(timestamp);        // Já é string de data

    return `Atualizado em ${date.toLocaleDateString('pt-BR')}`;
  };

  // Filtrar trilhas de acordo com o status selecionado
  const trilhasFiltradas =
    filtro === "all"
      ? courses
      : courses.filter((trilha) => trilha.status === filtro);

  // Handler para quando o filtro muda no TrilhasHeader
  const handleFiltroChange = (novoFiltro) => {
    setFiltro(novoFiltro);
  };

  return (
    <div className="trilhas-container">
      <div className="featured-content-row">
        <ContinueLearning />
        <QuadradoDaTrilha />
      </div>
      <TrilhasHeader onFiltroChange={handleFiltroChange} filtroAtual={filtro} />
      <TrilhasCarousel trilhas={trilhasFiltradas} />
    </div>
  );
};

export default Trilhas;
