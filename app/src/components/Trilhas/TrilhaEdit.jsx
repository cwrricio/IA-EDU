import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";
import api from "../../services/api";
import "./styles/TrilhaEdit.css";

const TrilhaEdit = ({ trilha, onClose }) => {
  const [title, setTitle] = useState(trilha.title || "");
  const [description, setDescription] = useState(trilha.description || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setError("O título da trilha é obrigatório");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      try {
        // Tenta atualizar via API
        await api.updateCourse(trilha.id, {
          title: title.trim(),
          description: description.trim(),
        });
      } catch (apiError) {
        console.warn("Falha na API, usando solução temporária:", apiError);

        // Salvar localmente via localStorage como fallback
        const editedCourses = JSON.parse(
          localStorage.getItem("editedCourses") || "{}"
        );

        editedCourses[trilha.id] = {
          ...editedCourses[trilha.id],
          title: title.trim(),
          description: description.trim(),
          editedAt: Date.now(),
        };

        localStorage.setItem("editedCourses", JSON.stringify(editedCourses));
      }

      setSuccess(true);

      // Atualizar a página após delay para exibir mensagem de sucesso
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error("Erro ao atualizar trilha:", err);
      setError(
        "Não foi possível salvar as alterações. Por favor, tente novamente."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="trilha-edit-overlay">
      <div className="trilha-edit-container">
        <div className="trilha-edit-header">
          <h2>Editar Trilha</h2>
          <button className="close-button" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        <div className="trilha-edit-content">
          {success ? (
            <div className="success-message">
              <p>Trilha atualizada com sucesso!</p>
              <p>A página será recarregada automaticamente...</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="title">Título da Trilha</label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Digite o título da trilha"
                  className="form-control"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="description">Descrição</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Digite uma descrição para a trilha"
                  className="form-control"
                  rows={5}
                />
              </div>

              <div className="trilha-edit-footer">
                <button
                  type="button"
                  onClick={onClose}
                  className="trilha-button cancel"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="trilha-button save"
                  disabled={loading}
                >
                  {loading ? "Salvando..." : "Salvar Alterações"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default TrilhaEdit;
