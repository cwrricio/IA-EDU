import { useState, useEffect } from "react";
import { VscDebugRestart, VscCheck, VscTrash } from "react-icons/vsc";
import { BiLoaderAlt, BiTrendingUp, BiMove } from "react-icons/bi";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  TouchSensor
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "./styles/SyllabusComponent.css";

// Componente para cada item arrastável
const SortableSyllabusItem = ({ id, text, onRemove, onEdit }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <li 
      ref={setNodeRef}
      className={`syllabus-item ${isDragging ? 'dragging' : ''}`} 
      style={style}
    >
      <div className="syllabus-item-content">
        {/* Alça para arrastar */}
        <div className="drag-handle" {...attributes} {...listeners}>
          <BiMove size={18} />
        </div>
        
        <span 
          className="syllabus-item-text"
          onClick={() => onEdit(id, text)}
        >
          {text}
        </span>
        
        <button
          className="syllabus-item-btn remove"
          onClick={() => onRemove(id)}
          title="Remover item"
        >
          <VscTrash size={16} />
        </button>
      </div>
    </li>
  );
};

// Componente editável
const EditableSyllabusItem = ({ newItemText, setNewItemText, handleKeyDown, saveEditItem }) => {
  return (
    <li className="syllabus-item editing">
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
    </li>
  );
};

const SyllabusComponent = ({ onBack, onContinue }) => {
  const [loading, setLoading] = useState(false);
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

  // Sensores para o drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Handler para finalizar o drag & drop
  const handleDragEnd = (event) => {
    const { active, over } = event;
    
    if (active.id !== over.id) {
      setSyllabusItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);
        
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Regenerar a lista de itens da ementa
  const regenerateSyllabus = () => {
    setLoading(true);

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
      setLoading(false);
    }, 1200);
  };

  // Adicionar novo item à ementa
  const addNewItem = () => {
    if (newItemText.trim()) {
      const newId = Date.now().toString();
      setSyllabusItems([...syllabusItems, { id: newId, text: newItemText }]);
      setNewItemText("");
    }
  };

  // Remover item da ementa
  const removeItem = (id) => {
    setSyllabusItems(syllabusItems.filter((item) => item.id !== id));
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
    } else if (e.key === "Escape") {
      setEditingItemId(null);
      setNewItemText("");
    }
  };

  // Manipular alteração no nível de aprofundamento
  const handleDepthChange = (e) => {
    const value = parseInt(e.target.value);
    setTopicDepth(value);
    updateSliderBackground(value);
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
          <DndContext 
            sensors={sensors} 
            collisionDetection={closestCenter} 
            onDragEnd={handleDragEnd}
          >
            <SortableContext items={syllabusItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
              {syllabusItems.map((item) => (
                editingItemId === item.id ? (
                  <EditableSyllabusItem
                    key={item.id}
                    newItemText={newItemText}
                    setNewItemText={setNewItemText}
                    handleKeyDown={handleKeyDown}
                    saveEditItem={saveEditItem}
                  />
                ) : (
                  <SortableSyllabusItem
                    key={item.id}
                    id={item.id}
                    text={item.text}
                    onRemove={removeItem}
                    onEdit={startEditItem}
                  />
                )
              ))}
            </SortableContext>
          </DndContext>
        </ul>

        {editingItemId === null && (
          <div className="syllabus-add-item">
            <input
              type="text"
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Adicionar novo item à ementa..."
              className="syllabus-add-input"
              disabled={editingItemId !== null}
            />
            <button
              className="syllabus-add-button"
              onClick={addNewItem}
              disabled={!newItemText.trim() || editingItemId !== null}
              title="Adicionar item"
            >
              {window.innerWidth <= 600 ? "Adicionar" : "➤"}
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
        >
          Avançar
        </button>
      </div>
    </div>
  );
};

export default SyllabusComponent;
