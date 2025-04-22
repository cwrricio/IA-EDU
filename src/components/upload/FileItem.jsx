import { useState, useEffect } from 'react';
import './styles/FileItem.css';

const FileItem = ({ file, progress: initialProgress, onRemove, status = 'uploading' }) => {
  const [progress, setProgress] = useState(initialProgress || 0);
  const [uploadStatus, setUploadStatus] = useState(status);

  const formatFileSize = (bytes) => {
    if (bytes < 1024 * 1024) {
      return `${Math.round(bytes / 1024)} KB`;
    }
    return `${Math.round(bytes / (1024 * 1024))} MB`;
  };

  useEffect(() => {
    let progressInterval;
    
    if (uploadStatus === 'uploading' && progress < 100) {
      progressInterval = setInterval(() => {
        setProgress(prevProgress => {
          const increment = Math.floor(Math.random() * 15) + 5;
          const newProgress = Math.min(prevProgress + increment, 99);
          
          // Simulando upload completo quando chega a 99%
          if (newProgress >= 99) {
            clearInterval(progressInterval);
            
            // Simulando chance de sucesso ou falha (90% de chance de sucesso)
            const isSuccess = Math.random() < 0.9;
            
            setTimeout(() => {
              setUploadStatus(isSuccess ? 'success' : 'error');
              setProgress(isSuccess ? 100 : 95); // Em caso de erro, mantém em 95%
            }, 500);
          }
          
          return newProgress;
        });
      }, 300);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [uploadStatus]);

  const getProgressBarClass = () => {
    if (uploadStatus === 'success') return 'file-item-progress-bar success';
    if (uploadStatus === 'error') return 'file-item-progress-bar error';
    return 'file-item-progress-bar';
  };

  return (
    <div className="file-item">
      <div className="file-item-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M7 12L10 15L17 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <div className="file-item-info">
        <div className="file-item-name">{file.name}</div>
        <div className="file-item-size">{formatFileSize(file.size)}</div>
      </div>
      <div className="file-item-progress-container">
        <div 
          className={getProgressBarClass()} 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={`file-item-progress-text ${uploadStatus}`}>
        {uploadStatus === 'error' ? 'Falha' : `${progress}%`}
      </div>
      <button className="file-item-remove" onClick={() => onRemove(file)}>
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
};

export default FileItem;