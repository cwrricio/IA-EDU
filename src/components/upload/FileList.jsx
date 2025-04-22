import FileItem from './FileItem';
import './styles/FileList.css';

const FileList = ({ files, onRemoveFile }) => {
  return (
    <div className="file-list">
      {files.map((file) => (
        <FileItem 
          key={file.id} 
          file={file.file} 
          progress={file.progress} 
          onRemove={onRemoveFile}
        />
      ))}
    </div>
  );
};

export default FileList;