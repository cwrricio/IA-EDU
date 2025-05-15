import { useNavigate } from "react-router-dom";
// Importação específica dos ícones
import { VscHome, VscBook, VscArrowLeft } from "react-icons/vsc";
import "./styles/TopBar.css";

const TopBar = ({ courseTitle, contentTitle }) => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1); // Volta para a página anterior
  };

  const handleHome = () => {
    navigate("/home");
  };

  const handleTrilhas = () => {
    navigate("/trilhas");
  };

  return (
    <div className="topbar">
      <div className="topbar-left">
        <button className="topbar-button" onClick={handleBack} title="Voltar">
          <VscArrowLeft size={24} color="white" />
        </button>
        <div className="topbar-logo-container">
          <img src="/mentor.svg" alt="MentorIA Logo" className="topbar-logo" />
          <div className="topbar-info">
            <h1 className="topbar-title">{courseTitle || "MentorIA"}</h1>
            {contentTitle && <p className="topbar-subtitle">{contentTitle}</p>}
          </div>
        </div>
      </div>

      <div className="topbar-right">
        <button className="topbar-button" onClick={handleTrilhas} title="Trilhas">
          <VscBook size={24} color="white" />
        </button>
        <button className="topbar-button" onClick={handleHome} title="Início">
          <VscHome size={24} color="white" />
        </button>
      </div>
    </div>
  );
};

export default TopBar;