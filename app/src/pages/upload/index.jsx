import { useState } from 'react';
import UploadHeader from '../../components/upload/UploadHeader';
import DropZone from '../../components/upload/DropZone';
import FileList from '../../components/upload/FileList';
import UploadActions from '../../components/upload/UploadActions';
import ObjectivesComponent from '../../components/upload/ObjectivesComponent';
import SyllabusComponent from '../../components/upload/SyllabusComponent';
import ContentListComponent from '../../components/upload/ContentListComponent';
import CompletionScreen from '../../components/upload/CompletionScreen';
import './upload.css';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'objectives', 'syllabus', 'content', 'completion'

  const handleFilesSelected = (selectedFiles) => {
    const newFiles = selectedFiles.map(file => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      file,
      progress: Math.floor(Math.random() * 100) // Simulação de progresso
    }));
    
    setFiles(prev => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileToRemove) => {
    setFiles(prev => prev.filter(file => file.file !== fileToRemove));
  };

  const handleCancel = () => {
    setFiles([]);
    // Aqui você pode adicionar navegação para voltar à página anterior
  };

  const handleAttach = () => {
    console.log('Files attached:', files);
    setCurrentStep('objectives');
  };
  
  const handleBackToUpload = () => {
    setCurrentStep('upload');
  };
  
  const handleContinueToSyllabus = () => {
    console.log('Continuing to syllabus definition');
    setCurrentStep('syllabus');
  };

  const handleBackToObjectives = () => {
    setCurrentStep('objectives');
  };
  
  const handleContinueToContent = () => {
    console.log('Continuing to content');
    setCurrentStep('content');
  };

  const handleBackToSyllabus = () => {
    setCurrentStep('syllabus');
  };
  
  const handleFinish = () => {
    console.log('Workflow completed with files:', files);
    setCurrentStep('completion');
  };

  const onUploadComplete = (result) => {
    console.log('Upload complete:', result);
    // Aqui você pode lidar com o resultado do upload, como armazenar os dados ou exibir uma mensagem
  }

  return (
    <div className="upload-container">
      <div className="upload-card">
        {currentStep === 'upload' && (
          <>
            <UploadHeader />
            <DropZone onFilesSelected={handleFilesSelected} onUploadComplete={onUploadComplete}/>
            {files.length > 0 && (
              <FileList files={files} onRemoveFile={handleRemoveFile} />
            )}
            <UploadActions onCancel={handleCancel} onAttach={handleAttach} />
          </>
        )}
        
        {currentStep === 'objectives' && (
          <ObjectivesComponent
            onBack={handleBackToUpload}
            onContinue={handleContinueToSyllabus}
          />
        )}

        {currentStep === 'syllabus' && (
          <SyllabusComponent
            onBack={handleBackToObjectives}
            onContinue={handleContinueToContent}
          />
        )}

        {currentStep === 'content' && (
          <ContentListComponent
            onBack={handleBackToSyllabus}
            onContinue={handleFinish}
          />
        )}

        {currentStep === 'completion' && (
          <CompletionScreen />
        )}
      </div>
    </div>
  );
};

export default UploadPage;