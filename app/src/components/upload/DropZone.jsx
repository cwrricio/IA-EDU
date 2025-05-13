import React, { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import "./styles/DropZone.css";
import api from "../../services/api";

const DropZone = ({ onFilesSelected, onUploadComplete }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Verifica se a função callback existe antes de chamá-la
      if (typeof onFilesSelected === "function") {
        onFilesSelected(acceptedFiles);
        handleUpload(acceptedFiles);
      } else {
        console.warn("onFilesSelected não está definido ou não é uma função");
      }
    },
    [onFilesSelected]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    multiple: true,
  });

  const handleUpload = async (file) => {
    try {
      // código de upload
      // ...

      // Verificar se a função existe antes de chamá-la
      if (typeof onUploadComplete === "function") {
        onUploadComplete(responseData);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  return (
    <div
      {...getRootProps()}
      className={`drop-zone ${isDragActive ? "active" : ""}`}
      onClick={() => fileInputRef.current.click()}
    >
      <input
        {...getInputProps()}
        ref={fileInputRef}
        className="drop-zone-input"
        accept=".pdf,.txt,.doc,.docx"
        multiple
      />
      <div className="drop-zone-icon">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
          <path d="M11 14.9V16h2v-1.1c2.28-.46 4-2.48 4-4.9 0-2.76-2.24-5-5-5S7 7.24 7 10c0 2.42 1.72 4.44 4 4.9zM12 8c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3z" />
        </svg>
      </div>
      <div className="drop-zone-text">
        <span className="drop-zone-title">Clique para carregar</span> ou arraste
        e solte
        <p className="drop-zone-hint">Tamanho máximo 50 MB.</p>
      </div>
    </div>
  );
};

export default DropZone;
