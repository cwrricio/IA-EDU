import { useState } from 'react';
import UploadHeader from '../../components/upload/UploadHeader';
import DropZone from '../../components/upload/DropZone';
import FileList from '../../components/upload/FileList';
import UploadActions from '../../components/upload/UploadActions';
import ContentConfirmation from '../../components/upload/ContentConfirmation';
import ObjectivesComponent from '../../components/upload/ObjectivesComponent';
import SyllabusComponent from '../../components/upload/SyllabusComponent';
import './upload.css';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'confirmation', 'objectives', ou 'syllabus'

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
    setCurrentStep('confirmation');
  };
  
  const handleBackToUpload = () => {
    setCurrentStep('upload');
  };
  
  const handleContinueToObjectives = () => {
    console.log('Continuing to objectives with files:', files);
    setCurrentStep('objectives');
  };
  
  const handleBackToConfirmation = () => {
    setCurrentStep('confirmation');
  };
  
  const handleContinueToSyllabus = () => {
    console.log('Continuing to syllabus definition');
    setCurrentStep('syllabus');
  };

  const handleBackToObjectives = () => {
    setCurrentStep('objectives');
  };
  
  const handleFinish = () => {
    console.log('Workflow completed with files:', files);
    // Aqui você pode navegar para a próxima etapa do fluxo
    alert('Projeto finalizado com sucesso!');
  };

  return (
    <div className="upload-container">
      <div className="upload-card">
        {currentStep === 'upload' && (
          <>
            <UploadHeader />
            <DropZone onFilesSelected={handleFilesSelected} />
            {files.length > 0 && (
              <FileList files={files} onRemoveFile={handleRemoveFile} />
            )}
            <UploadActions onCancel={handleCancel} onAttach={handleAttach} />
          </>
        )}
        
        {currentStep === 'confirmation' && (
          <ContentConfirmation 
            onBack={handleBackToUpload} 
            onContinue={handleContinueToObjectives} 
          />
        )}
        
        {currentStep === 'objectives' && (
          <ObjectivesComponent
            onBack={handleBackToConfirmation}
            onContinue={handleContinueToSyllabus}
          />
        )}

        {currentStep === 'syllabus' && (
          <SyllabusComponent
            onBack={handleBackToObjectives}
            onContinue={handleFinish}
          />
        )}
      </div>
    </div>
  );
};

export default UploadPage;