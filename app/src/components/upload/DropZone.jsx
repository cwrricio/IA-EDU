import { useRef, useState } from 'react';
import './styles/DropZone.css';
import api from '../../services/api';

const DropZone = ({ onFilesSelected, onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
      handleUpload(Array.from(e.dataTransfer.files));
    }
  };

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      handleUpload(Array.from(e.target.files));
    }
  };

  const handleUpload = async (acceptedFiles) => {
    setIsLoading(true);
    try {
      const file = acceptedFiles[0];
      const result = await api.uploadDocument(file);
      onUploadComplete(result);
    } catch (error) {
      console.error("Upload failed:", error);
      // Handle error state
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className={`drop-zone ${isDragging ? 'dragging' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <div className="drop-zone-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M11 14.9V16h2v-1.1c2.28-.46 4-2.48 4-4.9 0-2.76-2.24-5-5-5S7 7.24 7 10c0 2.42 1.72 4.44 4 4.9zM12 8c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
        </svg>
      </div>
      <div className="drop-zone-text">
        <span className="drop-zone-title">Clique para carregar</span> ou arraste e solte
        <p className="drop-zone-hint">Tamanho máximo 50 MB.</p>
      </div>
      <input 
        type="file" 
        ref={fileInputRef} 
        className="drop-zone-input" 
        accept=".pdf,.txt,.doc,.docx" 
        onChange={handleFileChange}
        multiple
      />
    </div>
  );
};

export default DropZone;