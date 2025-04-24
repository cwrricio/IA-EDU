import { VscCheck } from "react-icons/vsc";
import "./styles/CompletionScreen.css";

const CompletionScreen = () => {
  return (
    <div className="completion-container">
      <div className="completion-icon-container">
        <div className="completion-icon-circle">
          <VscCheck size={60} className="completion-icon" />
        </div>
      </div>
      
      <h2 className="completion-title">Fornecimento de Dados concluído!</h2>
      <p className="completion-message">Acesse sua trilha abaixo</p>
      
      <button className="completion-button">
        Voltar ao painel
      </button>
    </div>
  );
};

export default CompletionScreen;