import { useState, useEffect, useRef } from "react";
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
import api from "../../services/api";
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

const SyllabusComponent = ({ onBack, onContinue, documentAnalysis, savedData }) => {
  const [loading, setLoading] = useState(false);
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItemText, setNewItemText] = useState("");
  const [topicDepth, setTopicDepth] = useState(3); // Nível de aprofundamento (1-5)
  const [syllabusItems, setSyllabusItems] = useState([]);

  const apiCallMadeRef = useRef(false);
  const prevDocumentAnalysis = useRef(null);

  // Modificar o useEffect que busca a ementa

  useEffect(() => {
    // Se temos dados salvos, use-os em vez de chamar a API
    if (savedData && savedData.topics && Array.isArray(savedData.topics)) {
      const formattedItems = savedData.topics.map(topic => ({
        id: topic.id.toString(),
        text: topic.title,
        depth: topic.depth || 3
      }));
      setSyllabusItems(formattedItems);
      return; // Saia do useEffect sem chamar a API
    }

    // Somente chamar a API se o documento mudar ou for a primeira chamada
    if (documentAnalysis === prevDocumentAnalysis.current) return;
    prevDocumentAnalysis.current = documentAnalysis;

    const fetchSyllabus = async () => {
      try {
        setLoading(true);

        // Usar o conteúdo do documento como contexto
        const context = documentAnalysis ||
          "Course on AI applications in education to help teachers utilize technology for enhancing student learning experiences";

        const result = await api.generateSyllabus({ context });
        console.log('API response for syllabus:', result);

        if (result && result.topics && Array.isArray(result.topics)) {
          // Converter o formato da resposta da API para o formato usado pelo componente
          const formattedItems = result.topics.map(topic => ({
            id: topic.id.toString(),
            text: topic.title,
            depth: topic.depth
          }));
          setSyllabusItems(formattedItems);
        }
      } catch (error) {
        console.error('Error fetching syllabus:', error);
        // Manter os itens padrão em caso de erro
      } finally {
        setLoading(false);
      }
    };

    fetchSyllabus();
  }, [documentAnalysis, savedData]);

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
  const regenerateSyllabus = async () => {
    try {
      setLoading(true);

      // Usar o mesmo contexto do documento anexado
      const context = documentAnalysis ||
        "Course on AI applications in education to help teachers utilize technology for enhancing student learning experiences";

      const result = await api.generateSyllabus({ context });
      console.log('API response for syllabus regeneration:', result);

      if (result && result.topics && Array.isArray(result.topics)) {
        // Converter o formato da resposta da API
        const formattedItems = result.topics.map(topic => ({
          id: topic.id.toString(),
          text: topic.title,
          depth: topic.depth || 3 // Usar profundidade padrão 3 se não especificada
        }));
        setSyllabusItems(formattedItems);
      }
    } catch (error) {
      console.error('Error regenerating syllabus:', error);
    } finally {
      setLoading(false);
    }
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
