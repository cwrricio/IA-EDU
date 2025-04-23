import { VscCheck } from "react-icons/vsc";
import './styles/ContentConfirmation.css';

const ContentConfirmation = ({ onBack, onContinue }) => {
  return (
    <div className="content-confirmation">
      <div className="confirmation-header">
        <h2 className="confirmation-title">Conteúdo recebido</h2>
        <div className="confirmation-icon">
          <VscCheck size={22} />
        </div>
      </div>
      
      <div className="content-summary">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Este conteúdo contém informações sobre 
          estrutura curricular, metodologias de ensino e avaliação de desempenho. 
          O documento aborda temas relacionados à educação básica, com foco em 
          competências e habilidades para o desenvolvimento integral do aluno.
        </p>
      </div>
      
      <div className="confirmation-actions">
        <button className="confirmation-back-btn" onClick={onBack}>
          Voltar
        </button>
        <button className="confirmation-continue-btn" onClick={onContinue}>
          Avançar
        </button>
      </div>
    </div>
  );
};

export default ContentConfirmation;