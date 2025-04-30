import { VscCheck } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import "./styles/CompletionScreen.css";

const CompletionScreen = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/home"); // Alterado de "/dashboard" para "/home"
  };

  return (
    <div className="completion-container">
      <div className="completion-icon-container">
        <div className="completion-icon-circle">
          <VscCheck size={60} className="completion-icon" />
        </div>
      </div>

      <h2 className="completion-title">Fornecimento de Dados concluído!</h2>
      <p className="completion-message">Acesse sua trilha abaixo</p>

      <button className="completion-button" onClick={handleBackToDashboard}>
        Voltar à página inicial
      </button>
    </div>
  );
};

export default CompletionScreen;
