import './styles/UploadActions.css';

const UploadActions = ({ onCancel, onAttach }) => {
  return (
    <div className="upload-actions">
      <button className="upload-cancel-btn" onClick={onCancel}>
        Cancelar
      </button>
      <button className="upload-attach-btn" onClick={onAttach}>
        Anexar arquivos
      </button>
    </div>
  );
};

export default UploadActions;