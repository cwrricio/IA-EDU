import { useState, useEffect } from "react";
import {
  VscDebugRestart,
  VscCheck,
  VscEdit,
  VscTrash,
  VscSend,
} from "react-icons/vsc";
import { BiLoaderAlt, BiTrendingUp } from "react-icons/bi";
import "./styles/SyllabusComponent.css";

const SyllabusComponent = ({ onBack, onContinue }) => {
  const [syllabusApproved, setSyllabusApproved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItemText, setNewItemText] = useState("");
  const [topicDepth, setTopicDepth] = useState(3); // Nível de aprofundamento (1-5)

  // Estado inicial com itens da ementa
  const [syllabusItems, setSyllabusItems] = useState([
    { id: "1", text: "Introdução à Inteligência Artificial na Educação" },
    { id: "2", text: "Fundamentos Pedagógicos para Implementação de IA" },
    { id: "3", text: "Ferramentas e Plataformas de IA para Ensino" },
    { id: "4", text: "Metodologias de Ensino Potencializadas por IA" },
    { id: "5", text: "Avaliação de Aprendizagem Assistida por IA" },
    { id: "6", text: "Personalização do Ensino com Algoritmos Adaptativos" },
  ]);

  // Regenerar a lista de itens da ementa
  const regenerateSyllabus = () => {
    setLoading(true);
    setSyllabusApproved(false);

    // Simular chamada a uma API (timeout para demonstração)
    setTimeout(() => {
      setSyllabusItems([
        { id: "1", text: "Contexto Histórico da Tecnologia Educacional" },
        { id: "2", text: "Paradigmas de IA Aplicados à Educação" },
        { id: "3", text: "Análise de Dados Educacionais" },
        { id: "4", text: "Design de Experiências de Aprendizagem com IA" },
        { id: "5", text: "Ética e Responsabilidade no Uso de IA na Educação" },
        { id: "6", text: "Implementação de Sistemas Tutores Inteligentes" },
        {
          id: "7",
          text: "Avaliação de Impacto de Tecnologias IA no Processo de Aprendizagem",
        },
      ]);
      setTopicDepth(4); // Sugestão de novo nível de aprofundamento
      setLoading(false);
    }, 1200);
  };

  // Adicionar novo item à ementa
  const addNewItem = () => {
    if (newItemText.trim()) {
      const newId = Date.now().toString();
      setSyllabusItems([...syllabusItems, { id: newId, text: newItemText }]);
      setNewItemText("");
      setSyllabusApproved(false);
    }
  };

  // Remover item da ementa
  const removeItem = (id) => {
    setSyllabusItems(syllabusItems.filter((item) => item.id !== id));
    setSyllabusApproved(false);
  };

  // Iniciar edição de um item
  const startEditItem = (id, text) => {
    setEditingItemId(id);
    setNewItemText(text);
  };

  // Salvar item editado
  const saveEditItem = () => {
    if (newItemText.trim() && editingItemId) {
      setSyllabusItems(
        syllabusItems.map((item) =>
          item.id === editingItemId ? { ...item, text: newItemText } : item
        )
      );
      setEditingItemId(null);
      setNewItemText("");
      setSyllabusApproved(false);
    }
  };

  // Mover item para cima ou para baixo na lista
  const moveItem = (id, direction) => {
    const currentIndex = syllabusItems.findIndex((item) => item.id === id);
    if (
      (direction === "up" && currentIndex > 0) ||
      (direction === "down" && currentIndex < syllabusItems.length - 1)
    ) {
      const newIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
      const newItems = [...syllabusItems];
      const [movedItem] = newItems.splice(currentIndex, 1);
      newItems.splice(newIndex, 0, movedItem);

      setSyllabusItems(newItems);
      setSyllabusApproved(false);
    }
  };

  // Função para atualizar o gradiente do slider
  const updateSliderBackground = (value) => {
    const percent = ((value - 1) / 4) * 100;
    const slider = document.getElementById("topicDepthSlider");
    if (slider) {
      slider.style.background = `linear-gradient(to right, #2563eb 0%, #2563eb ${percent}%, #e5e7eb ${percent}%, #e5e7eb 100%)`;
    }
  };

  // Lidar com a tecla Enter para adicionar/salvar item
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      if (editingItemId) {
        saveEditItem();
      } else {
        addNewItem();
      }
    }
  };

  // Manipular alteração no nível de aprofundamento
  const handleDepthChange = (e) => {
    const value = parseInt(e.target.value);
    setTopicDepth(value);
    updateSliderBackground(value);
    setSyllabusApproved(false);
  };

  // Inicializar o gradiente quando o componente for montado
  useEffect(() => {
    updateSliderBackground(topicDepth);
  }, []);

  // Textos descritivos para os níveis de aprofundamento
  const depthDescriptions = [
    "Introdutório",
    "Básico",
    "Intermediário",
    "Avançado",
    "Especializado"
  ];

  return (
    <div className="syllabus-container">
      <div className="syllabus-header">
        <h2 className="syllabus-title">Ementa do Plano de Ensino</h2>
        <div className="syllabus-actions">
          <button
            className={`action-button reload ${loading ? "loading" : ""}`}
            onClick={regenerateSyllabus}
            disabled={loading}
            title="Regenerar ementa"
          >
            {loading ? (
              <BiLoaderAlt className="icon spin-animation" size={20} />
            ) : (
              <VscDebugRestart className="icon" size={20} />
            )}
          </button>
          <button
            className={`action-button edit ${editing ? "active" : ""}`}
            onClick={() => setEditing(!editing)}
            title={editing ? "Finalizar edição" : "Editar ementa"}
          >
            <VscEdit className="icon" size={20} />
          </button>
          <button
            className={`action-button approve ${
              syllabusApproved ? "approved" : ""
            }`}
            onClick={() => setSyllabusApproved(!syllabusApproved)}
            title="Aprovar ementa"
          >
            <VscCheck className="icon" size={20} />
          </button>
        </div>
      </div>

      {/* Barra de Aprofundamento de Tópicos */}
      <div className="topic-depth-container">
        <div className="topic-depth-header">
          <div className="topic-depth-icon">
            <BiTrendingUp size={20} />
          </div>
          <h3>Aprofundamento de Tópicos</h3>
        </div>
        <div className="topic-depth-slider-container">
          <input
            type="range"
            min="1"
            max="5"
            value={topicDepth}
            onChange={handleDepthChange}
            className="topic-depth-slider"
            disabled={!editing}
            id="topicDepthSlider"
          />
          <div className="topic-depth-labels">
            {depthDescriptions.map((label, index) => (
              <span 
                key={index} 
                className={`depth-label ${index + 1 === topicDepth ? 'active' : ''}`}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
        <div className="topic-depth-description">
          <p>
            {topicDepth === 1 && "Cobertura introdutória dos tópicos, focando em conceitos fundamentais sem grande aprofundamento."}
            {topicDepth === 2 && "Abordagem básica dos tópicos, com exploração moderada de aplicações e exemplos práticos."}
            {topicDepth === 3 && "Nível intermediário de aprofundamento, equilibrando teoria e prática com discussões substanciais."}
            {topicDepth === 4 && "Tratamento avançado dos tópicos, incluindo análises críticas e estudos de caso complexos."}
            {topicDepth === 5 && "Aprofundamento especializado, explorando nuances, pesquisas recentes e aplicações inovadoras."}
          </p>
        </div>
      </div>

      <div className={`syllabus-content ${loading ? "loading-content" : ""}`}>
        <ul className="syllabus-list">
          {syllabusItems.map((item) => (
            <li key={item.id} className="syllabus-item">
              {editingItemId === item.id ? (
                <div className="syllabus-item-edit">
                  <input
                    type="text"
                    value={newItemText}
                    onChange={(e) => setNewItemText(e.target.value)}
                    onKeyDown={handleKeyDown}
                    className="syllabus-edit-input"
                    autoFocus
                  />
                  <button
                    className="syllabus-item-btn save"
                    onClick={saveEditItem}
                    title="Salvar"
                  >
                    <VscCheck size={16} />
                  </button>
                </div>
              ) : (
                <>
                  <span className="syllabus-item-text">{item.text}</span>
                  {editing && (
                    <div className="syllabus-item-actions">
                      <button
                        className="syllabus-item-btn move-up"
                        onClick={() => moveItem(item.id, "up")}
                        disabled={syllabusItems.indexOf(item) === 0}
                        title="Mover para cima"
                      >
                        ↑
                      </button>
                      <button
                        className="syllabus-item-btn move-down"
                        onClick={() => moveItem(item.id, "down")}
                        disabled={
                          syllabusItems.indexOf(item) ===
                          syllabusItems.length - 1
                        }
                        title="Mover para baixo"
                      >
                        ↓
                      </button>
                      <button
                        className="syllabus-item-btn edit"
                        onClick={() => startEditItem(item.id, item.text)}
                        title="Editar item"
                      >
                        <VscEdit size={16} />
                      </button>
                      <button
                        className="syllabus-item-btn remove"
                        onClick={() => removeItem(item.id)}
                        title="Remover item"
                      >
                        <VscTrash size={16} />
                      </button>
                    </div>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>

        {editing && editingItemId === null && (
          <div className="syllabus-add-item">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Adicionar novo item à ementa..."
              className="syllabus-add-input"
            />
            <button
              className="syllabus-add-button"
              onClick={addNewItem}
              disabled={!newItemText.trim()}
              title="Adicionar item"
            >
              ➤
            </button>
          </div>
        )}

        {loading && (
          <div className="loading-overlay">
            <BiLoaderAlt className="icon spin-animation" size={24} />
          </div>
        )}
      </div>

      <div className="syllabus-navigation">
        <button className="syllabus-back-btn" onClick={onBack}>
          Voltar
        </button>
        <button
          className="syllabus-continue-btn"
          onClick={onContinue}
          disabled={!syllabusApproved}
        >
          Avançar
        </button>
      </div>
    </div>
  );
};

export default SyllabusComponent;
