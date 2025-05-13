import React, { useState, useEffect } from "react";
import "./styles/FileItem.css";
import { BiFile } from "react-icons/bi";

const FileItem = ({
  file,
  progress: initialProgress,
  onRemove,
  status = "uploading",
}) => {
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

    if (uploadStatus === "uploading" && progress < 100) {
      progressInterval = setInterval(() => {
        setProgress((prevProgress) => {
          const increment = Math.floor(Math.random() * 15) + 5;
          const newProgress = Math.min(prevProgress + increment, 99);

          // Simulando upload completo quando chega a 99%
          if (newProgress >= 99) {
            clearInterval(progressInterval);

            // Simulando chance de sucesso ou falha (90% de chance de sucesso)
            const isSuccess = Math.random() < 0.9;

            setTimeout(() => {
              setUploadStatus(isSuccess ? "success" : "error");
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
    if (uploadStatus === "success") return "file-item-progress-bar success";
    if (uploadStatus === "error") return "file-item-progress-bar error";
    return "file-item-progress-bar";
  };

  // Adicione uma verificação antes de chamar a função
  const handleRemove = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Verificar se onRemove é uma função antes de chamá-la
    if (typeof onRemove === "function") {
      onRemove(file);
    } else {
      console.error("onRemove não é uma função", onRemove);
    }
  };

  return (
    <div className="file-item">
      <div className="file-icon">
        <BiFile size={24} />
      </div>
      <div className="file-details">
        <div className="file-name">{file.name}</div>
        <div className="file-size">{formatFileSize(file.size)}</div>
      </div>
      <div className="file-item-progress-container">
        <div
          className={getProgressBarClass()}
          style={{ width: `${progress}%` }}
        ></div>
      </div>
      <div className={`file-item-progress-text ${uploadStatus}`}>
        {uploadStatus === "error" ? "Falha" : `${progress}%`}
      </div>
      <button
        className="remove-file-btn"
        onClick={handleRemove}
        aria-label="Remover arquivo"
      >
        <span>×</span>
      </button>
    </div>
  );
};

export default FileItem;
