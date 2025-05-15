import React from "react";
import {
  FaBook,
  FaCalculator,
  FaFlask,
  FaGraduationCap,
  FaLanguage,
  FaAtom,
  FaChalkboardTeacher,
  FaCogs,
  FaLaptopCode,
  FaBrain,
  FaGlobe,
  FaUserGraduate,
} from "react-icons/fa";
import "./styles/IconSelector.css";

const iconOptions = [
  { id: "graduate", icon: FaUserGraduate, label: "Estudante" },
  { id: "book", icon: FaBook, label: "Livro" },
  { id: "calculator", icon: FaCalculator, label: "Matemática" },
  { id: "flask", icon: FaFlask, label: "Química" },
  { id: "graduation-cap", icon: FaGraduationCap, label: "Formatura" },
  { id: "language", icon: FaLanguage, label: "Linguagens" },
  { id: "atom", icon: FaAtom, label: "Física" },
  { id: "teacher", icon: FaChalkboardTeacher, label: "Professor" },
  { id: "cogs", icon: FaCogs, label: "Engenharia" },
  { id: "code", icon: FaLaptopCode, label: "Programação" },
  { id: "brain", icon: FaBrain, label: "Conhecimento" },
  { id: "globe", icon: FaGlobe, label: "Geografia" },
];

const IconSelector = ({ selectedIcon, onSelectIcon }) => {
  return (
    <div className="icon-selector-container">
      <h3 className="icon-selector-title">Escolha um ícone para sua trilha</h3>
      <div className="icon-options-grid">
        {iconOptions.map((option) => (
          <div
            key={option.id}
            className={`icon-option ${
              selectedIcon === option.id ? "selected" : ""
            }`}
            onClick={() => onSelectIcon(option.id)}
          >
            <div className="icon-wrapper">
              <option.icon size={32} />
            </div>
            <span className="icon-label">{option.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default IconSelector;
export { iconOptions };
