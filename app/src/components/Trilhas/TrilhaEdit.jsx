import React, { useState, useEffect } from "react";
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
import "./styles/TrilhaEdit.css";

function TrilhaEdit({ trilha, onClose, onUpdate }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedIcon, setSelectedIcon] = useState("PiStudent");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Objeto com todos os ícones disponíveis
  const iconOptions = {
    PiStudent: { component: PiStudent, name: "Estudante" },
    PiMathOperations: { component: PiMathOperations, name: "Matemática" },
    PiAtom: { component: PiAtom, name: "Ciências" },
    PiBooks: { component: PiBooks, name: "Literatura" },
    PiCode: { component: PiCode, name: "Programação" },
    PiFlask: { component: PiFlask, name: "Química" },
    PiChalkboardTeacher: { component: PiChalkboardTeacher, name: "Professor" },
    PiPencil: { component: PiPencil, name: "Escrita" },
    PiGlobe: { component: PiGlobe, name: "Geografia" },
    PiRobot: { component: PiRobot, name: "Tecnologia" },
    PiMicroscope: { component: PiMicroscope, name: "Biologia" },
    PiPaintBrush: { component: PiPaintBrush, name: "Artes" },
  };

  useEffect(() => {
    if (trilha) {
      setTitle(trilha.title || "");
      setDescription(trilha.description || "");

      // Log para depuração
      console.log(`TrilhaEdit - Ícone recebido: ${trilha.icon}`);

      // Configurar o ícone a partir da trilha
      if (trilha.icon && iconOptions[trilha.icon]) {
        setSelectedIcon(trilha.icon);
      } else {
        // Usar ícone padrão apenas se não houver ícone definido
        setSelectedIcon("PiStudent");
      }
    }
  }, [trilha]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Incluir explicitamente o ícone no objeto de dados
      const updatedTrilha = {
        ...trilha,
        title,
        description,
        icon: selectedIcon, // Garantir que o ícone está sendo incluído
      };

      console.log("Dados sendo enviados para atualização:", updatedTrilha);

      // Chamar API para atualizar a trilha
      const result = await api.updateCourse(trilha.id, updatedTrilha);

      console.log("Resposta da API:", result);

      // Chamar função de refresh para atualizar a lista de trilhas
      if (typeof onUpdate === "function") {
        console.log("Chamando onUpdate com os dados atualizados");
        onUpdate(updatedTrilha);
      }

      onClose();
    } catch (error) {
      console.error("Erro ao atualizar trilha:", error);
      setError("Erro ao atualizar trilha. Tente novamente mais tarde.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title">Editar Trilha</h5>
          <button type="button" className="close-button" onClick={onClose}>
            ×
          </button>
        </div>
        <div className="modal-body">
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger">{error}</div>}
            <div className="form-group mb-3">
              <label>Título</label>
              <input
                type="text"
                className="form-control"
                placeholder="Digite o título da trilha"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Descrição</label>
              <textarea
                className="form-control"
                rows={2}
                placeholder="Digite a descrição da trilha"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <div className="form-group mb-3">
              <label>Ícone</label>
              <div className="icon-selector">
                {Object.keys(iconOptions).map((iconKey) => {
                  const IconComponent = iconOptions[iconKey].component;
                  return (
                    <div
                      key={iconKey}
                      className={`icon-option ${
                        selectedIcon === iconKey ? "selected" : ""
                      }`}
                      onClick={() => setSelectedIcon(iconKey)}
                      title={iconOptions[iconKey].name}
                    >
                      <IconComponent />
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="button-group">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? "Salvando..." : "Salvar"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default TrilhaEdit;
