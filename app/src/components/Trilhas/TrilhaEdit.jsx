import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../../services/api";
import "./styles/TrilhaEdit.css";
import { toast } from "react-toastify";

const TrilhaEdit = ({ trilha, onClose, onUpdate }) => {
  const [title, setTitle] = useState(trilha.title);
  const [description, setDescription] = useState(trilha.description || "");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // Utilizamos apenas o novo método para atualizar título e descrição
      await api.updateCourseTitleAndDescription(trilha.id, title, description);

      toast.success("Curso atualizado com sucesso!");

      // Notificar o componente pai sobre a atualização
      if (onUpdate) {
        onUpdate({
          ...trilha,
          title,
          description,
        });
      }

      // Fecha o modal de edição
      onClose();
    } catch (error) {
      console.error("Erro ao atualizar curso:", error);
      toast.error("Erro ao atualizar curso. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trilha-edit-overlay">
      <div className="trilha-edit-container">
        <div className="trilha-edit-header">
          <h2>Editar Curso</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="trilha-edit-content">
          <div className="edit-field">
            <label htmlFor="title">Título do Curso</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Título do curso"
              className="edit-input"
              required
            />
          </div>

          <div className="edit-field">
            <label htmlFor="description">Descrição</label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Descreva o conteúdo do curso"
              className="edit-textarea"
              rows={5}
            />
          </div>
        </div>

        <div className="trilha-edit-footer">
          <button
            className="cancel-button"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </button>
          <button
            className="save-button"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Salvando..." : "Salvar Alterações"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TrilhaEdit;
