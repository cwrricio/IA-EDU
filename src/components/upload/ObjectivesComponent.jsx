import { useState } from "react";
import {
  VscDebugRestart,
  VscCheck,
  VscEdit,
  VscTrash,
  VscSend,
  VscChevronDown,
  VscChevronUp,
} from "react-icons/vsc";
import { BiLoaderAlt } from "react-icons/bi";
import "./styles/ObjectivesComponent.css";

const ObjectivesComponent = ({ onBack, onContinue }) => {
  const [generalApproved, setGeneralApproved] = useState(false);
  const [specificApproved, setSpecificApproved] = useState(false);
  const [disableSpecific, setDisableSpecific] = useState(false);
  const [generalEditing, setGeneralEditing] = useState(false);
  const [specificEditing, setSpecificEditing] = useState(false);
  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [loadingSpecific, setLoadingSpecific] = useState(false);
  
  // Estado para o objetivo geral
  const [generalText, setGeneralText] = useState(
    "O objetivo geral deste projeto é promover o uso de inteligência artificial como ferramenta auxiliar no processo educacional, melhorando a qualidade do ensino e facilitando a personalização do aprendizado de acordo com as necessidades individuais dos alunos."
  );
  
  // Estado para objetivos específicos como lista
  const [specificItems, setSpecificItems] = useState([
    { id: "1", text: "Identificar as principais tecnologias de IA aplicáveis ao contexto educacional" },
    { id: "2", text: "Desenvolver habilidades para implementação de ferramentas de IA no processo de ensino" },
    { id: "3", text: "Avaliar o impacto da IA na personalização da aprendizagem" },
    { id: "4", text: "Criar estratégias de ensino potencializadas por sistemas de IA" },
    { id: "5", text: "Compreender os aspectos éticos envolvidos na aplicação de IA na educação" }
  ]);
  
  // Estado para edição de objetivo específico
  const [editingItemId, setEditingItemId] = useState(null);
  const [newItemText, setNewItemText] = useState("");

  const regenerateGeneral = () => {
    setLoadingGeneral(true);
    setGeneralApproved(false);
    // Simular API call
    setTimeout(() => {
      setGeneralText(
        "Este projeto tem como objetivo principal integrar tecnologias de inteligência artificial no ambiente educacional, visando aprimorar os processos de ensino-aprendizagem, otimizar a prática docente e proporcionar experiências personalizadas aos estudantes conforme suas necessidades e ritmos individuais."
      );
      setLoadingGeneral(false);
    }, 1500);
  };

  const regenerateSpecific = () => {
    setLoadingSpecific(true);
    setSpecificApproved(false);
    // Simular API call
    setTimeout(() => {
      setSpecificItems([
        { id: "1", text: "Explorar diferentes aplicações de IA para resolução de desafios educacionais" },
        { id: "2", text: "Capacitar educadores para o uso crítico de ferramentas baseadas em IA" },
        { id: "3", text: "Analisar dados educacionais para tomada de decisões pedagógicas informadas" },
        { id: "4", text: "Desenvolver projetos de aprendizagem adaptativa com suporte de IA" },
        { id: "5", text: "Avaliar a eficácia de sistemas de tutoria inteligente no progresso dos alunos" },
        { id: "6", text: "Promover a inclusão digital através de tecnologias adaptativas de IA" }
      ]);
      setLoadingSpecific(false);
    }, 1500);
  };

  // Funções para gerenciar objetivos específicos como lista
  const addNewItem = () => {
    if (newItemText.trim()) {
      const newId = Date.now().toString();
      setSpecificItems([...specificItems, { id: newId, text: newItemText }]);
      setNewItemText("");
      setSpecificApproved(false);
    }
  };

  const removeItem = (id) => {
    setSpecificItems(specificItems.filter(item => item.id !== id));
    setSpecificApproved(false);
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
      setSpecificApproved(false);
    }
  };

  const moveItem = (id, direction) => {
    const currentIndex = specificItems.findIndex(item => item.id === id);
    if ((direction === 'up' && currentIndex > 0) || 
        (direction === 'down' && currentIndex < specificItems.length - 1)) {
      
      const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
      const newItems = [...specificItems];
      const [movedItem] = newItems.splice(currentIndex, 1);
      newItems.splice(newIndex, 0, movedItem);
      
      setSpecificItems(newItems);
      setSpecificApproved(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      if (editingItemId) {
        saveEditItem();
      } else {
        addNewItem();
      }
    }
  };

  const toggleSpecificSection = () => {
    setDisableSpecific(!disableSpecific);
    if (!disableSpecific) {
      setSpecificApproved(true);
    } else {
      setSpecificApproved(false);
    }
  };

  const allApproved = () => {
    return generalApproved && (specificApproved || disableSpecific);
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
            <button
              className={`action-button edit ${generalEditing ? "active" : ""}`}
              onClick={() => setGeneralEditing(!generalEditing)}
              title="Editar objetivo geral"
            >
              <VscEdit className="icon" size={20} />
            </button>
            <button
              className={`action-button approve ${generalApproved ? "approved" : ""}`}
              onClick={() => setGeneralApproved(!generalApproved)}
              title="Aprovar objetivo geral"
            >
              <VscCheck className="icon" size={20} />
            </button>
          </div>
        </div>
        <div className={`objective-content for-textarea ${loadingGeneral ? "loading-content" : ""} ${generalEditing ? "editing" : ""}`}>
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
      <div className={`objective-section ${disableSpecific ? "disabled" : ""}`}>
        <div className="objective-header">
          <h3>Objetivos Específicos</h3>
          <div className="objective-actions">
            <button
              className="toggle-switch"
              onClick={toggleSpecificSection}
              title={disableSpecific ? "Habilitar objetivos específicos" : "Desabilitar objetivos específicos"}
            >
              <VscChevronDown
                className={`toggle-icon ${disableSpecific ? "disabled" : "enabled"}`}
                size={22}
              />
            </button>
            <button
              className={`action-button reload ${loadingSpecific ? "loading" : ""}`}
              onClick={regenerateSpecific}
              disabled={loadingSpecific || disableSpecific}
              title="Regenerar objetivos específicos"
            >
              {loadingSpecific ? (
                <BiLoaderAlt className="icon spin-animation" size={20} />
              ) : (
                <VscDebugRestart className="icon" size={20} />
              )}
            </button>
            <button
              className={`action-button edit ${specificEditing ? "active" : ""}`}
              onClick={() => setSpecificEditing(!specificEditing)}
              disabled={disableSpecific}
              title="Editar objetivos específicos"
            >
              <VscEdit className="icon" size={20} />
            </button>
            <button
              className={`action-button approve ${specificApproved ? "approved" : ""}`}
              onClick={() => setSpecificApproved(!specificApproved)}
              disabled={disableSpecific}
              title="Aprovar objetivos específicos"
            >
              <VscCheck className="icon" size={20} />
            </button>
          </div>
        </div>

        {/* Lista de objetivos específicos */}
        <div className={`objective-content ${loadingSpecific ? "loading-content" : ""}`}>
          <ul className="objectives-list">
            {specificItems.map((item) => (
              <li key={item.id} className="objectives-list-item">
                {editingItemId === item.id && specificEditing ? (
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
                ) : (
                  <>
                    <span className="objectives-item-text">{item.text}</span>
                    {specificEditing && (
                      <div className="objectives-item-actions">
                        <button 
                          className="objectives-item-btn move-up"
                          onClick={() => moveItem(item.id, 'up')}
                          disabled={specificItems.indexOf(item) === 0}
                          title="Mover para cima"
                        >
                          ↑
                        </button>
                        <button 
                          className="objectives-item-btn move-down"
                          onClick={() => moveItem(item.id, 'down')}
                          disabled={specificItems.indexOf(item) === specificItems.length - 1}
                          title="Mover para baixo"
                        >
                          ↓
                        </button>
                        <button 
                          className="objectives-item-btn edit"
                          onClick={() => startEditItem(item.id, item.text)}
                          title="Editar item"
                        >
                          <VscEdit size={16} />
                        </button>
                        <button 
                          className="objectives-item-btn remove"
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

          {specificEditing && editingItemId === null && (
            <div className="objectives-add-item">
              <input
                type="text"
                value={newItemText}
                onChange={(e) => setNewItemText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Adicionar novo objetivo específico..."
                className="objectives-add-input"
              />
              <button 
                className="objectives-add-button"
                onClick={addNewItem}
                disabled={!newItemText.trim()}
                title="Adicionar objetivo"
              >
                ➤
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
          disabled={!allApproved()}
        >
          Avançar
        </button>
      </div>
    </div>
  );
};

export default ObjectivesComponent;
