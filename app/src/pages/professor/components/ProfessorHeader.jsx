import React, { useState } from "react";

const ProfessorHeader = ({ onFilterChange, currentFilter }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleFilterSelect = (type) => {
    onFilterChange(type);
    setDropdownOpen(false);
  };

  return (
    <div className="professor-header">
      <h1 className="professor-title">Minhas Disciplinas</h1>

      <div className="dropdown-container">
        <button className="dropdown-button" onClick={toggleDropdown}>
          {currentFilter === "all"
            ? "Todas as Disciplinas"
            : currentFilter === "completed"
            ? "Disciplinas Completas"
            : "Disciplinas em Progresso"}
          <span className={`dropdown-icon ${dropdownOpen ? "open" : ""}`}>
            ▼
          </span>
        </button>

        {dropdownOpen && (
          <div className="dropdown-menu">
            <div
              className="dropdown-item"
              onClick={() => handleFilterSelect("all")}
            >
              Todas as Disciplinas
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleFilterSelect("completed")}
            >
              Disciplinas Completas
            </div>
            <div
              className="dropdown-item"
              onClick={() => handleFilterSelect("in-progress")}
            >
              Disciplinas em Progresso
            </div>
          </div>
        )}
      </div>

      <button className="professor-new-btn">Nova Disciplina</button>
    </div>
  );
};

export default ProfessorHeader;
