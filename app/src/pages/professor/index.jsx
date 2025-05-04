import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./professor.css";
import Sidebar from "../../components/sidebar/Sidebar";
import TrilhaCard from "../../components/Trilhas/TrilhaCard";

const ProfessorPage = () => {
  const navigate = useNavigate();
  const [filterType, setFilterType] = useState("all");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Dados de exemplo para as trilhas do professor
  const trilhasData = [
    {
      id: 1,
      title: "Estrutura de Dados",
      status: "em andamento",
      date: "Atualizado em 20/07/2023",
      description:
        "Estudo das principais estruturas de dados e suas aplicações práticas.",
    },
    {
      id: 2,
      title: "Programação Orientada a Objetos",
      status: "em andamento",
      date: "Atualizado em 05/08/2023",
      description:
        "Conceitos avançados de orientação a objetos com implementações práticas.",
    },
  ];

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

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <div className="professor-container">
          <div className="professor-header">
            <h1 className="professor-title">Minhas Trilhas</h1>

            <div className="professor-actions">
              <div className="filter-dropdown">
                <button className="filter-button" onClick={toggleDropdown}>
                  {filterType === "all"
                    ? "Todas as Trilhas"
                    : filterType === "completed"
                    ? "Trilhas Concluídas"
                    : "Trilhas em Progresso"}{" "}
                  ▼
                </button>

                {dropdownOpen && (
                  <div className="filter-menu">
                    <div
                      className="filter-item"
                      onClick={() => handleFilterSelect("all")}
                    >
                      Todas as Trilhas
                    </div>
                    <div
                      className="filter-item"
                      onClick={() => handleFilterSelect("completed")}
                    >
                      Trilhas Concluídas
                    </div>
                    <div
                      className="filter-item"
                      onClick={() => handleFilterSelect("em andamento")}
                    >
                      Trilhas em Progresso
                    </div>
                  </div>
                )}
              </div>

              <button className="nova-trilha-btn" onClick={redirectToUpload}>
                Nova Trilha
              </button>
            </div>
          </div>

          <div className="trilhas-grid">
            {trilhasData
              .filter(
                (trilha) => filterType === "all" || trilha.status === filterType
              )
              .map((trilha) => (
                <TrilhaCard key={trilha.id} trilha={trilha} />
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorPage;
