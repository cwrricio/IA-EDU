import { useState } from "react";
import { VscDebugRestart, VscCheck, VscCheckAll, VscEdit } from "react-icons/vsc";
import { FiToggleLeft, FiToggleRight } from "react-icons/fi";
import { BiLoaderAlt } from "react-icons/bi";
import "./styles/ObjectivesComponent.css";

const ObjectivesComponent = ({ onBack, onContinue }) => {
  const [generalApproved, setGeneralApproved] = useState(false);
  const [specificApproved, setSpecificApproved] = useState(false);
  const [disableSpecific, setDisableSpecific] = useState(false);
  const [generalText, setGeneralText] = useState(
    "O objetivo geral deste projeto é promover o uso de inteligência artificial como ferramenta auxiliar no processo educacional, melhorando a qualidade do ensino e facilitando a personalização do aprendizado de acordo com as necessidades individuais dos alunos."
  );
  const [specificText, setSpecificText] = useState(
    "1. Desenvolver competências digitais nos professores para utilização de IA em sala de aula;\n2. Implementar ferramentas de IA capazes de analisar o desempenho dos estudantes;\n3. Criar conteúdo personalizado baseado em modelos de aprendizagem adaptativa;\n4. Estabelecer métricas para avaliação do impacto da IA no processo de ensino-aprendizagem."
  );
  const [loadingGeneral, setLoadingGeneral] = useState(false);
  const [loadingSpecific, setLoadingSpecific] = useState(false);
  const [editingGeneral, setEditingGeneral] = useState(false);
  const [editingSpecific, setEditingSpecific] = useState(false);
  const [tempGeneralText, setTempGeneralText] = useState(generalText);
  const [tempSpecificText, setTempSpecificText] = useState(specificText);

  const regenerateGeneralText = () => {
    setLoadingGeneral(true);

    // Simular chamada a uma API (timeout para demonstração)
    setTimeout(() => {
      setGeneralText(
        "Integrar tecnologias de inteligência artificial ao ambiente educacional para otimizar processos pedagógicos, ampliar o alcance do ensino e desenvolver métodos inovadores de transmissão de conhecimento adaptados às demandas do século XXI."
      );
      setGeneralApproved(false);
      setLoadingGeneral(false);
    }, 1200);
  };

  const regenerateSpecificText = () => {
    setLoadingSpecific(true);

    // Simular chamada a uma API (timeout para demonstração)
    setTimeout(() => {
      setSpecificText(
        "1. Capacitar educadores na utilização de ferramentas baseadas em IA;\n2. Criar sistemas de avaliação contínua através de algoritmos de aprendizagem;\n3. Desenvolver materiais didáticos adaptativos que respondam às necessidades individuais;\n4. Estabelecer protocolos de uso ético da IA no contexto educacional."
      );
      setSpecificApproved(false);
      setLoadingSpecific(false);
    }, 1200);
  };

  const handleEditGeneral = () => {
    if (editingGeneral) {
      // Salvar as alterações
      setGeneralText(tempGeneralText);
      setGeneralApproved(false);
    } else {
      // Entrar no modo de edição
      setTempGeneralText(generalText);
    }
    setEditingGeneral(!editingGeneral);
  };

  const handleEditSpecific = () => {
    if (editingSpecific) {
      // Salvar as alterações
      setSpecificText(tempSpecificText);
      setSpecificApproved(false);
    } else {
      // Entrar no modo de edição
      setTempSpecificText(specificText);
    }
    setEditingSpecific(!editingSpecific);
  };

  return (
    <div className="objectives-container">
      <h2 className="objectives-title">Objetivos do Projeto</h2>

      <div className="objective-section">
        <div className="objective-header">
          <h3>Objetivo Geral</h3>
          <div className="objective-actions">
            <button
              className={`action-button edit ${editingGeneral ? "active" : ""}`}
              onClick={handleEditGeneral}
              title={editingGeneral ? "Salvar alterações" : "Editar objetivo"}
            >
              <VscEdit className="icon" size={20} />
            </button>
            <button
              className={`action-button reload ${
                loadingGeneral ? "loading" : ""
              }`}
              onClick={regenerateGeneralText}
              title="Regenerar objetivo"
              disabled={loadingGeneral || editingGeneral}
            >
              {loadingGeneral ? (
                <BiLoaderAlt className="icon spin-animation" size={20} />
              ) : (
                <VscDebugRestart className="icon" size={20} />
              )}
            </button>
            <button
              className={`action-button approve ${
                generalApproved ? "approved" : ""
              }`}
              onClick={() => setGeneralApproved(!generalApproved)}
              title="Aprovar objetivo"
              disabled={editingGeneral}
            >
              {generalApproved ? (
                <VscCheck className="icon" size={22} />
              ) : (
                <VscCheck className="icon" size={20} />
              )}
            </button>
          </div>
        </div>
        <div
          className={`objective-content ${
            loadingGeneral ? "loading-content" : ""
          } ${editingGeneral ? "editing" : ""}`}
        >
          {editingGeneral ? (
            <textarea 
              value={tempGeneralText}
              onChange={(e) => setTempGeneralText(e.target.value)}
              className="objective-textarea"
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

      <div className={`objective-section ${disableSpecific ? "disabled" : ""}`}>
        <div className="objective-header">
          <h3>Objetivos Específicos</h3>
          <div className="objective-actions">
            <button
              className="toggle-switch"
              onClick={() => setDisableSpecific(!disableSpecific)}
              title={
                disableSpecific
                  ? "Habilitar objetivos específicos"
                  : "Desabilitar objetivos específicos"
              }
            >
              {disableSpecific ? (
                <FiToggleLeft className="toggle-icon disabled" size={28} />
              ) : (
                <FiToggleRight className="toggle-icon enabled" size={28} />
              )}
            </button>
            <button
              className={`action-button edit ${editingSpecific ? "active" : ""}`}
              onClick={handleEditSpecific}
              title={editingSpecific ? "Salvar alterações" : "Editar objetivos específicos"}
              disabled={disableSpecific}
            >
              <VscEdit className="icon" size={20} />
            </button>
            <button
              className={`action-button reload ${
                loadingSpecific ? "loading" : ""
              }`}
              onClick={regenerateSpecificText}
              disabled={disableSpecific || loadingSpecific || editingSpecific}
            >
              {loadingSpecific ? (
                <BiLoaderAlt className="icon spin-animation" size={20} />
              ) : (
                <VscDebugRestart className="icon" size={20} />
              )}
            </button>
            <button
              className={`action-button approve ${
                specificApproved ? "approved" : ""
              }`}
              onClick={() => setSpecificApproved(!specificApproved)}
              disabled={disableSpecific || editingSpecific}
            >
              {specificApproved ? (
                <VscCheckAll className="icon" size={22} />
              ) : (
                <VscCheck className="icon" size={20} />
              )}
            </button>
          </div>
        </div>
        <div
          className={`objective-content ${
            loadingSpecific ? "loading-content" : ""
          } ${editingSpecific ? "editing" : ""}`}
        >
          {editingSpecific ? (
            <textarea 
              value={tempSpecificText}
              onChange={(e) => setTempSpecificText(e.target.value)}
              className="objective-textarea"
              autoFocus
            />
          ) : (
            <pre>{specificText}</pre>
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
          disabled={!generalApproved}
        >
          Avançar
        </button>
      </div>
    </div>
  );
};

export default ObjectivesComponent;
