import React from "react";
import FileItem from "./FileItem";
import "./styles/FileList.css";

const FileList = ({ files, onRemove }) => {
  return (
    <div className="file-list">
      {files &&
        files.length > 0 &&
        files.map((fileData, index) => (
          <FileItem
            key={index}
            file={fileData.file}
            name={fileData.name || fileData.file.name}
            onRemove={onRemove}
          />
        ))}
    </div>
  );
};

export default FileList;
