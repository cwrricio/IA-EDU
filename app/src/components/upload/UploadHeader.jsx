import "./styles/UploadHeader.css";

const UploadHeader = () => {
  return (
    <div className="upload-header">
      <div className="upload-header-top">
        <img src="/mentor.svg" alt="MentorIA" className="upload-logo" />
        <div className="upload-title-container">
          <h2 className="upload-title">Carregue e confirme os arquivos</h2>
          <p className="upload-subtitle">
            Carregue arquivos PDF para esse projeto.
          </p>
        </div>
      </div>
    </div>
  );
};

export default UploadHeader;
