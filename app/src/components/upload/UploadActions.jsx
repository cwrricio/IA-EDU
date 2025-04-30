import { useNavigate } from "react-router-dom";
import "./styles/UploadActions.css";

const UploadActions = ({ onCancel, onAttach }) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    if (onCancel) onCancel();
    navigate("/home"); // Alterado de "/dashboard" para "/home"
  };

  return (
    <div className="upload-actions">
      <button className="upload-cancel-btn" onClick={handleCancel}>
        Cancelar
      </button>
      <button className="upload-attach-btn" onClick={onAttach}>
        Anexar arquivos
      </button>
    </div>
  );
};

export default UploadActions;
