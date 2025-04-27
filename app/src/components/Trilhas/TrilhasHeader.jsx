import React, { useState } from "react";
import { IoChevronDown } from "react-icons/io5";
import "./styles/TrilhasHeader.css";

const TrilhasHeader = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="trilhas-header">
      <h1>Trilhas</h1>

      <div className="dropdown-container">
        <button className="dropdown-button" onClick={() => setIsOpen(!isOpen)}>
          <span>Todas as trilhas</span>
          <IoChevronDown className={`dropdown-icon ${isOpen ? "open" : ""}`} />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            <div className="dropdown-item">Todas as trilhas</div>
            <div className="dropdown-item">Em andamento</div>
            <div className="dropdown-item">Concluídas</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrilhasHeader;
