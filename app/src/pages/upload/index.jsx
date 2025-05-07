import { useState, useRef, useEffect } from 'react';
import UploadHeader from '../../components/upload/UploadHeader';
import DropZone from '../../components/upload/DropZone';
import FileList from '../../components/upload/FileList';
import UploadActions from '../../components/upload/UploadActions';
import ObjectivesComponent from '../../components/upload/ObjectivesComponent';
import SyllabusComponent from '../../components/upload/SyllabusComponent';
import ContentListComponent from '../../components/upload/ContentListComponent';
import CompletionScreen from '../../components/upload/CompletionScreen';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from '../../services/api';
import './upload.css';

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState('upload'); // 'upload', 'objectives', 'syllabus', 'content', 'completion'
  const [documentAnalysis, setDocumentAnalysis] = useState(null);
  const courseIdRef = useRef(null);
  const [objectivesData, setObjectivesData] = useState(null);
  const [syllabusData, setSyllabusData] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");

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
    if (files.length === 0) {
      // Mostrar mensagem de erro
      toast.error("Por favor, anexe pelo menos um documento antes de continuar.");
      return;
    }

    console.log('Files attached:', files);
    setCurrentStep('objectives');
  };

  const handleBackToUpload = () => {
    setCurrentStep('upload');
  };

  // Update this handler to collect objectives data
  const handleContinueToSyllabus = async () => {
    // Get objectives data from the ObjectivesComponent
    // This would ideally be passed through a ref or callback
    const objectivesComponentData = {
      general: document.querySelector('.objective-content p')?.textContent || '',
      specific: Array.from(document.querySelectorAll('.objectives-item-text')).map(
        (item, index) => ({
          id: String(index + 1),
          text: item.textContent.trim()
        })
      )
    };

    setObjectivesData(objectivesComponentData);

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { id: "1" };

    try {
      // Save progress to the database
      const response = await api.saveProgress({
        user_id: user.id,
        course_id: courseIdRef.current,
        step: "objectives",
        content: objectivesComponentData,
        title: courseTitle || "Curso Educacional",
        description: courseDescription || "" // Ensure it's always at least an empty string
      });

      // Store the course ID for future updates
      if (!courseIdRef.current && response.course_id) {
        courseIdRef.current = response.course_id;
      }

      console.log('Objectives saved:', response);
      toast.success("Objetivos salvos com sucesso!");

      // Continue to next step
      setCurrentStep('syllabus');
    } catch (error) {
      console.error('Error saving objectives:', error);
      toast.error("Erro ao salvar objetivos: " + error.message);
      // Still move to next step even if saving failed
      setCurrentStep('syllabus');
    }
  };

  const handleBackToObjectives = () => {
    setCurrentStep('objectives');
  };

  // Update this handler to collect syllabus data
  const handleContinueToContent = async () => {

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { id: "1" };

    // Get syllabus data from the SyllabusComponent
    const syllabusComponentData = {
      topics: Array.from(document.querySelectorAll('.syllabus-item-text')).map(
        (item, index) => ({
          id: index + 1,
          title: item.textContent.trim(),
          depth: 3 // Default to 3, you'll need to adjust this to get actual values
        })
      )
    };

    setSyllabusData(syllabusComponentData);

    try {
      // Save progress to the database
      const response = await api.saveProgress({
        user_id: user.id,
        course_id: courseIdRef.current,
        step: "syllabus",
        content: syllabusComponentData,
        description: courseDescription || "" // Ensure it's always at least an empty string
      });

      console.log('Syllabus saved:', response);
      toast.success("Ementa salva com sucesso!");

      // Continue to next step
      setCurrentStep('content');
    } catch (error) {
      console.error('Error saving syllabus:', error);
      toast.error("Erro ao salvar ementa: " + error.message);
      // Still move to next step even if saving failed
      setCurrentStep('content');
    }
  };

  const handleBackToSyllabus = () => {
    setCurrentStep('syllabus');
  };

  // Update this handler to collect content data
  const handleFinish = async () => {

    const userString = localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : { id: "1" };

    // Get content data from ContentListComponent
    const contentComponentData = {
      content_items: Array.from(document.querySelectorAll('.content-item')).map(
        (item, index) => ({
          id: index + 1,
          title: item.querySelector('.content-item-title')?.textContent || '',
          description: item.querySelector('.content-item-description')?.textContent || '',
        })
      )
    };

    setContentData(contentComponentData);

    try {
      // Save progress to the database
      const response = await api.saveProgress({
        user_id: user.id,
        course_id: courseIdRef.current,
        step: "content",
        content: contentComponentData,
        description: courseDescription || "" // Ensure it's always at least an empty string
      });

      console.log('Content saved:', response);
      toast.success("Conteúdo salvo com sucesso!");

      // Continue to completion screen
      setCurrentStep('completion');
    } catch (error) {
      console.error('Error saving content:', error);
      toast.error("Erro ao salvar conteúdo: " + error.message);
      // Still move to completion screen even if saving failed
      setCurrentStep('completion');
    }
  };

  const onUploadComplete = async (result) => {
    console.log('Upload complete:', result);
    setDocumentAnalysis(result.analysis);
    
    try {
      // Gerar um título para o curso
      const titleResponse = await api.generateTitle({ context: result.analysis });
      if (titleResponse && titleResponse.title) {
        setCourseTitle(titleResponse.title);
        
        // Depois de obter o título, gere a descrição
        const descResponse = await api.generateDescription({ 
          context: result.analysis,
          title: titleResponse.title 
        });
        
        if (descResponse && descResponse.description) {
          setCourseDescription(descResponse.description);
        }
      }
    } catch (error) {
      console.error('Error generating course metadata:', error);
      // Fallback: gerar um título baseado no nome do arquivo
      if (files && files.length > 0) {
        const fileName = files[0].file.name.replace(/\.\w+$/, "");
        const formattedTitle = fileName
          .replace(/[-_]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase());
        setCourseTitle(`Curso de ${formattedTitle}`);
        setCourseDescription(`Material educacional sobre ${formattedTitle}`);
      }
    }
  };

  // Adicione esta função ao seu UploadPage component
  const generateTitleFromAnalysis = async () => {
    if (!documentAnalysis) return;

    try {
      const titleResponse = await api.generateTitle({ context: documentAnalysis });
      if (titleResponse && titleResponse.title) {
        setCourseTitle(titleResponse.title);
      }
    } catch (error) {
      console.error('Error generating title:', error);
      // Manter o título atual ou gerar um baseado no nome do arquivo
    }
  };

  // Chame essa função após o upload ser completado
  useEffect(() => {
    if (documentAnalysis) {
      generateTitleFromAnalysis();
    }
  }, [documentAnalysis]);

  return (
    <div className="upload-container">
      <div className="upload-card">
        {currentStep === 'upload' && (
          <>
            <UploadHeader />
            <DropZone onFilesSelected={handleFilesSelected} onUploadComplete={onUploadComplete} />
            {files.length > 0 && (
              <FileList files={files} onRemoveFile={handleRemoveFile} />
            )}
            <UploadActions onCancel={handleCancel} onAttach={handleAttach} />
          </>
        )}

        {currentStep === 'objectives' && (
          <>
            {documentAnalysis && currentStep === 'objectives' && (
              <div className="course-metadata-preview">
                <h3>Curso gerado:</h3>
                <div className="course-title-preview">
                  <strong>Título:</strong> {courseTitle}
                </div>
                <div className="course-description-preview">
                  <strong>Descrição:</strong> {courseDescription}
                </div>
                <p className="metadata-note">Estes dados foram gerados automaticamente e serão salvos com o curso.</p>
              </div>
            )}
            <ObjectivesComponent
              onBack={handleBackToUpload}
              onContinue={handleContinueToSyllabus}
              documentAnalysis={documentAnalysis}
            />
          </>
        )}

        {currentStep === 'syllabus' && (
          <SyllabusComponent
            onBack={handleBackToObjectives}
            onContinue={handleContinueToContent}
            documentAnalysis={documentAnalysis}
          />
        )}

        {currentStep === 'content' && (
          <ContentListComponent
            onBack={handleBackToSyllabus}
            onContinue={handleFinish}
            documentAnalysis={documentAnalysis}
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