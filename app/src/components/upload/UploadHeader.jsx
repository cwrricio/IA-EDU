import './styles/UploadHeader.css';

const UploadHeader = () => {
  return (
    <div className="upload-header">
      <h2 className="upload-title">Carregue e confirme os arquivos</h2>
      <p className="upload-subtitle">Carregue arquivos PDF para esse projeto.</p>
      <div className="upload-icon">✦</div>
    </div>
  );
};

export default UploadHeader;