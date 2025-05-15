import React, { useState, useRef, useEffect } from "react";
import { IoChevronDown } from "react-icons/io5";
import "./styles/TrilhasHeader.css";

const TrilhasHeader = ({ onFiltroChange, filtroAtual }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Mapear os valores de filtro para textos de exibição
  const filterLabels = {
    all: "Todas as trilhas",
    "em andamento": "Em andamento",
    concluido: "Concluídas",
  };

  // Manipular cliques fora do dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    // Adicionar listener quando o dropdown estiver aberto
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup do listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleFilterClick = (filter) => {
    onFiltroChange(filter);
    setIsOpen(false);
  };

  return (
    <div className="trilhas-header">
      <h1>Trilhas</h1>

      <div className="dropdown-container" ref={dropdownRef}>
        <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
          <span>{filterLabels[filtroAtual] || "Todas as trilhas"}</span>
          <IoChevronDown className={`dropdown-icon ${isOpen ? "open" : ""}`} />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            <div
              className="dropdown-item"
              onClick={() => handleFilterClick("all")}
            >
              Todas as trilhas
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleFilterClick("em andamento")}
            >
              Em andamento
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleFilterClick("concluido")}
            >
              Concluídas
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrilhasHeader;
