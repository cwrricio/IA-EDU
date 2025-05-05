import { VscCheck } from "react-icons/vsc";
import { useNavigate } from "react-router-dom";
import "./styles/CompletionScreen.css";

const CompletionScreen = () => {
  const navigate = useNavigate();

  const handleBackToDashboard = () => {
    navigate("/home");
  };

  return (
    <div className="completion-container">
      <img src="/mentor.svg" alt="MentorIA" className="completion-logo" />

      

      <h2 className="completion-title">Fornecimento de Dados concluído!</h2>
      <p className="completion-message">
        Sua trilha foi criada com sucesso. Acesse-a abaixo.
      </p>

      <button className="completion-button" onClick={handleBackToDashboard}>
        Voltar à página inicial
      </button>
    </div>
  );
};

export default CompletionScreen;
