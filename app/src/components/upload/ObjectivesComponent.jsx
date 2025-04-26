import { useState, useRef, useEffect } from "react";
import {
  VscDebugRestart,
  VscCheck,
  VscTrash
} from "react-icons/vsc";
import { BiLoaderAlt, BiMove } from "react-icons/bi";
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
import api from "../../services/api";
import { CSS } from "@dnd-kit/utilities";
import "./styles/ObjectivesComponent.css";

// Componente para cada item arrastável
const SortableObjectiveItem = ({ id, text, onRemove, onEdit }) => {
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
      className={`objectives-list-item ${isDragging ? 'dragging' : ''}`}
      style={style}
    >
      <div className="objectives-item-content">
        {/* Alça para arrastar */}
        <div className="objectives-item-handle" {...attributes} {...listeners}>
          <BiMove size={18} />
        </div>

        <span
          className="objectives-item-text"
          onClick={() => onEdit(id, text)}
        >
          {text}
        </span>

        <button
          className="objectives-item-btn remove"
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
const EditableObjectiveItem = ({ newItemText, setNewItemText, handleKeyDown, saveEditItem }) => {
  return (
    <li className="objectives-list-item editing">
      <div className="objectives-item-edit">
        <input
          type="text"
          value={newItemText}
          onChange={(e) => setNewItemText(e.target.value)}
          onKeyDown={handleKeyDown}
          className="objectives-edit-input"
          autoFocus
        />
        <button
          className="objectives-item-btn save"
          onClick={saveEditItem}
          title="Salvar"
        >
          <VscCheck size={16} />
        </button>
      </div>
    </li>
  );
};

const ObjectivesComponent = ({ onBack, onContinue, documentAnalysis }) => {
  const [generalEditing, setGeneralEditing] = useState(false);
  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [loadingSpecific, setLoadingSpecific] = useState(false);

  const [generalText, setGeneralText] = useState(""); // Estado para o objetivo geral
  const [specificItems, setSpecificItems] = useState([]); // Estado para objetivos específicos como lista

  // Estados para interação 
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItemText, setNewItemText] = useState("");

  const apiCallMadeRef = useRef(false);
  const prevDocumentAnalysis = useRef(null);

  useEffect(() => {
    // Somente chama a API se o documento mudar ou for a primeira chamada
    if (documentAnalysis === prevDocumentAnalysis.current) return;
    prevDocumentAnalysis.current = documentAnalysis;

    const fetchObjectives = async () => {
      try {
        setLoadingGeneral(true);
        setLoadingSpecific(true);

        // Usar o conteúdo do documento como contexto se disponível
        const context = documentAnalysis ||
          "Course on AI applications in education to help teachers utilize technology for enhancing student learning experiences";

        const result = await api.generateObjectives({ context });

        console.log('API response:', result);
        apiCallMadeRef.current = true;  // Marcar que a chamada foi feita

        if (result) {
          if (result.general) {
            setGeneralText(Array.isArray(result.general) ? result.general[0] : result.general);
          }
          if (result.specific && Array.isArray(result.specific)) {
            setSpecificItems(result.specific);
          }
        }
      } catch (error) {
        console.error('Error fetching objectives:', error);
      } finally {
        setLoadingGeneral(false);
        setLoadingSpecific(false);
      }
    };

    fetchObjectives();
  }, [documentAnalysis]);

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

  const regenerateGeneral = async () => {
    try {
      setLoadingGeneral(true);

      // Usar o mesmo contexto do documento anexado
      const context = documentAnalysis ||
        "Course on AI applications in education to help teachers utilize technology for enhancing student learning experiences";

      const result = await api.generateObjectives({ context });
      console.log('API response for general regeneration:', result);

      if (result && result.general) {
        setGeneralText(Array.isArray(result.general) ? result.general[0] : result.general);
      }
    } catch (error) {
      console.error('Error regenerating general objective:', error);
    } finally {
      setLoadingGeneral(false);
    }
  };

  const regenerateSpecific = async () => {
    try {
      setLoadingSpecific(true);

      // Usar o mesmo contexto do documento anexado
      const context = documentAnalysis ||
        "Course on AI applications in education to help teachers utilize technology for enhancing student learning experiences";

      const result = await api.generateObjectives({ context });
      console.log('API response for specific regeneration:', result);

      if (result && result.specific && Array.isArray(result.specific)) {
        setSpecificItems(result.specific);
      }
    } catch (error) {
      console.error('Error regenerating specific objectives:', error);
    } finally {
      setLoadingSpecific(false);
    }
  };


  // Handler para finalizar o drag & drop
  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setSpecificItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id);
        const newIndex = items.findIndex(item => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  // Funções para gerenciar objetivos específicos
  const addNewItem = () => {
    if (newItemText.trim()) {
      const newId = Date.now().toString();
      setSpecificItems([...specificItems, { id: newId, text: newItemText }]);
      setNewItemText("");
    }
  };

  const removeItem = (id) => {
    setSpecificItems(specificItems.filter(item => item.id !== id));
  };

  const startEditItem = (id, text) => {
    setEditingItemId(id);
    setNewItemText(text);
  };

  const saveEditItem = () => {
    if (newItemText.trim() && editingItemId) {
      setSpecificItems(
        specificItems.map(item =>
          item.id === editingItemId ? { ...item, text: newItemText } : item
        )
      );
      setEditingItemId(null);
      setNewItemText("");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (editingItemId) {
        saveEditItem();
      } else {
        addNewItem();
      }
    } else if (e.key === 'Escape') {
      setEditingItemId(null);
      setNewItemText("");
    }
  };

  return (
    <div className="objectives-container">
      <h2 className="objectives-title">Objetivos do Plano de Ensino</h2>

      {/* Seção de objetivo geral */}
      <div className="objective-section">
        <div className="objective-header">
          <h3>Objetivo Geral</h3>
          <div className="objective-actions">
            <button
              className={`action-button reload ${loadingGeneral ? "loading" : ""}`}
              onClick={regenerateGeneral}
              disabled={loadingGeneral}
              title="Regenerar objetivo geral"
            >
              {loadingGeneral ? (
                <BiLoaderAlt className="icon spin-animation" size={20} />
              ) : (
                <VscDebugRestart className="icon" size={20} />
              )}
            </button>
          </div>
        </div>
        <div
          className={`objective-content for-textarea ${loadingGeneral ? "loading-content" : ""} ${generalEditing ? "editing for-textarea" : ""}`}
          onClick={() => !generalEditing && setGeneralEditing(true)}
        >
          {generalEditing ? (
            <textarea
              className="objective-textarea"
              value={generalText}
              onChange={(e) => setGeneralText(e.target.value)}
              onBlur={() => setGeneralEditing(false)}
              autoFocus
            />
          ) : (
            <p>{generalText}</p>
          )}
          {loadingGeneral && (
            <div className="loading-overlay">
              <BiLoaderAlt className="icon spin-animation" size={24} />
            </div>
          )}
        </div>
      </div>

      {/* Seção de objetivos específicos */}
      <div className="objective-section">
        <div className="objective-header">
          <h3>Objetivos Específicos</h3>
          <div className="objective-actions">
            <button
              className={`action-button reload ${loadingSpecific ? "loading" : ""}`}
              onClick={regenerateSpecific}
              disabled={loadingSpecific}
              title="Regenerar objetivos específicos"
            >
              {loadingSpecific ? (
                <BiLoaderAlt className="icon spin-animation" size={20} />
              ) : (
                <VscDebugRestart className="icon" size={20} />
              )}
            </button>
          </div>
        </div>

        <div className={`objective-content ${loadingSpecific ? "loading-content" : ""}`}>
          <ul className="objectives-list">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext items={specificItems.map(item => item.id)} strategy={verticalListSortingStrategy}>
                {specificItems.map((item) => (
                  editingItemId === item.id ? (
                    <EditableObjectiveItem
                      key={item.id}
                      newItemText={newItemText}
                      setNewItemText={setNewItemText}
                      handleKeyDown={handleKeyDown}
                      saveEditItem={saveEditItem}
                    />
                  ) : (
                    <SortableObjectiveItem
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
            <div className="objectives-add-item">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Adicionar novo objetivo específico..."
                className="objectives-add-input"
                disabled={editingItemId !== null}
              />
              <button
                className="objectives-add-button"
                onClick={addNewItem}
                disabled={!newItemText.trim() || editingItemId !== null}
                title="Adicionar objetivo"
              >
                {window.innerWidth <= 600 ? "Adicionar" : "➤"}
              </button>
            </div>
          )}

          {loadingSpecific && (
            <div className="loading-overlay">
              <BiLoaderAlt className="icon spin-animation" size={24} />
            </div>
          )}
        </div>
      </div>

      <div className="objectives-actions">
        <button className="objectives-back-btn" onClick={onBack}>
          Voltar
        </button>
        <button
          className="objectives-continue-btn"
          onClick={onContinue}
        >
          Avançar
        </button>
      </div>
    </div>
  );
};

export default ObjectivesComponent;
