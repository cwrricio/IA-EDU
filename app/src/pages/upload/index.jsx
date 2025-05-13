import React, { useState, useRef, useEffect } from "react";
import Layout from "../../components/layout/Layout";
import UploadHeader from "../../components/upload/UploadHeader";
import DropZone from "../../components/upload/DropZone";
import FileList from "../../components/upload/FileList";
import UploadActions from "../../components/upload/UploadActions";
import ObjectivesComponent from "../../components/upload/ObjectivesComponent";
import SyllabusComponent from "../../components/upload/SyllabusComponent";
import ContentListComponent from "../../components/upload/ContentListComponent";
import CompletionScreen from "../../components/upload/CompletionScreen";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import api from "../../services/api";
import "./upload.css";
import { BiLoaderAlt } from "react-icons/bi";

const UploadPage = () => {
  const [files, setFiles] = useState([]);
  const [currentStep, setCurrentStep] = useState("upload"); // 'upload', 'objectives', 'syllabus', 'content', 'completion'
  const [documentAnalysis, setDocumentAnalysis] = useState(null);
  const courseIdRef = useRef(null);
  const [objectivesData, setObjectivesData] = useState(null);
  const [syllabusData, setSyllabusData] = useState(null);
  const [contentData, setContentData] = useState(null);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseDescription, setCourseDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Novo estado para controlar o loading
  const [objectives, setObjectives] = useState("");
  const [syllabus, setSyllabus] = useState("");
  const [contentList, setContentList] = useState("");
  const [courseData, setCourseData] = useState(null);

  const handleFilesSelected = (selectedFiles) => {
    const newFiles = selectedFiles.map((file) => ({
      id: Date.now() + Math.random().toString(36).substring(2, 9),
      file,
      progress: Math.floor(Math.random() * 100), // Simulação de progresso
    }));

    setFiles((prev) => [...prev, ...newFiles]);
  };

  const handleRemoveFile = (fileToRemove) => {
    setFiles((prev) => prev.filter((file) => file.file !== fileToRemove));
  };

  const handleCancel = () => {
    setFiles([]);
    // Aqui você pode adicionar navegação para voltar à página anterior
  };

  const handleAttach = () => {
    if (files.length === 0) {
      // Mostrar mensagem de erro
      toast.error(
        "Por favor, anexe pelo menos um documento antes de continuar."
      );
      return;
    }

    console.log("Files attached:", files);
    setCurrentStep("objectives");
  };

  const handleBackToUpload = () => {
    setCurrentStep("upload");
  };

  // Update this handler to collect objectives data
  const handleContinueToSyllabus = async () => {
    // Get objectives data from the ObjectivesComponent
    // This would ideally be passed through a ref or callback
    const objectivesComponentData = {
      general:
        document.querySelector(".objective-content p")?.textContent || "",
      specific: Array.from(
        document.querySelectorAll(".objectives-item-text")
      ).map((item, index) => ({
        id: String(index + 1),
        text: item.textContent.trim(),
      })),
    };

    setObjectivesData(objectivesComponentData);

    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { id: "1" };

    try {
      // Save progress to the database
      const response = await api.saveProgress({
        user_id: user.id,
        course_id: courseIdRef.current,
        step: "objectives",
        content: objectivesComponentData,
        title: courseTitle || "Curso Educacional",
        description: courseDescription || "", // Ensure it's always at least an empty string
      });

      // Store the course ID for future updates
      if (!courseIdRef.current && response.course_id) {
        courseIdRef.current = response.course_id;
      }

      console.log("Objectives saved:", response);
      toast.success("Objetivos salvos com sucesso!");

      // Continue to next step
      setCurrentStep("syllabus");
    } catch (error) {
      console.error("Error saving objectives:", error);
      toast.error("Erro ao salvar objetivos: " + error.message);
      // Still move to next step even if saving failed
      setCurrentStep("syllabus");
    }
  };

  const handleBackToObjectives = async () => {
    if (courseIdRef.current) {
      try {
        const courseData = await fetchSavedCourseData(courseIdRef.current);
        if (courseData && courseData.steps && courseData.steps.objectives) {
          setObjectivesData(courseData.steps.objectives);
        }
      } catch (error) {
        console.error("Error loading saved objectives:", error);
      }
    }
    setCurrentStep("objectives");
  };

  // Update this handler to collect syllabus data
  const handleContinueToContent = async () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { id: "1" };

    // Get syllabus data from the SyllabusComponent
    const syllabusComponentData = {
      topics: Array.from(document.querySelectorAll(".syllabus-item-text")).map(
        (item, index) => ({
          id: index + 1,
          title: item.textContent.trim(),
          depth: 3, // Default to 3, you'll need to adjust this to get actual values
        })
      ),
    };

    setSyllabusData(syllabusComponentData);

    try {
      // Save progress to the database
      const response = await api.saveProgress({
        user_id: user.id,
        course_id: courseIdRef.current,
        step: "syllabus",
        content: syllabusComponentData,
        description: courseDescription || "", // Ensure it's always at least an empty string
      });

      console.log("Syllabus saved:", response);
      toast.success("Ementa salva com sucesso!");

      // Continue to next step
      setCurrentStep("content");
    } catch (error) {
      console.error("Error saving syllabus:", error);
      toast.error("Erro ao salvar ementa: " + error.message);
      // Still move to next step even if saving failed
      setCurrentStep("content");
    }
  };

  const handleBackToSyllabus = async () => {
    if (courseIdRef.current) {
      try {
        const courseData = await fetchSavedCourseData(courseIdRef.current);
        if (courseData && courseData.steps && courseData.steps.syllabus) {
          setSyllabusData(courseData.steps.syllabus);
        }
      } catch (error) {
        console.error("Error loading saved syllabus:", error);
      }
    }
    setCurrentStep("syllabus");
  };

  // Update this handler to collect content data
  const handleFinish = async () => {
    const userString = localStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : { id: "1" };

    // Get content data from ContentListComponent
    const contentComponentData = {
      content_items: Array.from(document.querySelectorAll(".content-item")).map(
        (item, index) => ({
          id: index + 1,
          title: item.querySelector(".content-item-title")?.textContent || "",
          description:
            item.querySelector(".content-item-description")?.textContent || "",
        })
      ),
    };

    setContentData(contentComponentData);

    try {
      // Save progress to the database
      const response = await api.saveProgress({
        user_id: user.id,
        course_id: courseIdRef.current,
        step: "content",
        content: contentComponentData,
        description: courseDescription || "", // Ensure it's always at least an empty string
      });

      console.log("Content saved:", response);
      toast.success("Conteúdo salvo com sucesso!");

      // Continue to completion screen
      setCurrentStep("completion");
    } catch (error) {
      console.error("Error saving content:", error);
      toast.error("Erro ao salvar conteúdo: " + error.message);
      // Still move to completion screen even if saving failed
      setCurrentStep("completion");
    }
  };

  // Na função handleContinueToCompletion, certifique-se de incluir o título
  const handleContinueToCompletion = async (contentData) => {
    setContentData(contentData);
    await generateSlidesForCourse(contentData);
  };

  const onUploadComplete = async (result) => {
    console.log("Upload complete:", result);
    setDocumentAnalysis(result.analysis);

    try {
      // Gerar um título para o curso
      const titleResponse = await api.generateTitle({
        context: result.analysis,
      });
      if (titleResponse && titleResponse.title) {
        setCourseTitle(titleResponse.title);

        // Depois de obter o título, gere a descrição
        const descResponse = await api.generateDescription({
          context: result.analysis,
          title: titleResponse.title,
        });

        if (descResponse && descResponse.description) {
          setCourseDescription(descResponse.description);
        }
      }
    } catch (error) {
      console.error("Error generating course metadata:", error);
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
      const titleResponse = await api.generateTitle({
        context: documentAnalysis,
      });
      if (titleResponse && titleResponse.title) {
        setCourseTitle(titleResponse.title);
      }
    } catch (error) {
      console.error("Error generating title:", error);
      // Manter o título atual ou gerar um baseado no nome do arquivo
    }
  };

  // Chame essa função após o upload ser completado
  useEffect(() => {
    if (documentAnalysis) {
      generateTitleFromAnalysis();
    }
  }, [documentAnalysis]);

  // Adicionar estas funções para buscar dados do curso atual

  const fetchSavedCourseData = async (courseId) => {
    if (!courseId) return null;
    try {
      const result = await api.getCourseById(courseId);
      return result;
    } catch (error) {
      console.error("Error fetching course data:", error);
      return null;
    }
  };

  // Add this function to the component where you handle content completion

  const generateSlidesForCourse = async (contentData) => {
    setIsLoading(true);

    try {
      // Criar uma cópia dos dados de conteúdo
      const contentWithSlides = { ...contentData };
      contentWithSlides.content_items = [...contentData.content_items];

      // Exibir feedback inicial
      toast.info(
        `Iniciando geração de slides para ${contentWithSlides.content_items.length} tópicos...`
      );

      // Processar cada item de conteúdo sequencialmente
      for (let i = 0; i < contentWithSlides.content_items.length; i++) {
        const item = contentWithSlides.content_items[i];

        // Exibir progresso atual
        toast.info(
          `Gerando slides para: ${item.title} (${i + 1}/${
            contentWithSlides.content_items.length
          })`
        );

        try {
          // Verificar se o item tem conteúdo necessário
          if (!item.content) {
            console.warn(
              `Item ${item.id}: Conteúdo vazio, usando descrição como conteúdo.`
            );
            item.content = item.description;
          }

          console.log(`Gerando slides para item ${item.id}: ${item.title}`);

          // Adicionar um timeout para evitar sobrecarga da API
          await new Promise((resolve) => setTimeout(resolve, 500));

          const slidesResult = await api.generateSlides(item);

          console.log(`Slides gerados para item ${item.id}:`, slidesResult);

          // Adicionar os slides ao item de conteúdo
          contentWithSlides.content_items[i] = {
            ...item,
            slides: slidesResult?.slides || [],
          };
        } catch (error) {
          console.error(`Erro ao gerar slides para o item ${item.id}:`, error);
          toast.error(`Erro ao gerar slides para: ${item.title}`);
          // Continuar com o próximo item mesmo se este falhar
          contentWithSlides.content_items[i] = {
            ...item,
            slides: [], // Array vazio para itens com falha
          };
        }

        // Pequena pausa entre requisições para evitar sobrecarga
        await new Promise((resolve) => setTimeout(resolve, 2000));
      }

      // Salvar o conteúdo com os slides gerados
      const userString = localStorage.getItem("user");
      const user = userString ? JSON.parse(userString) : { id: "1" };

      toast.info("Salvando conteúdo com slides...");

      const response = await api.saveProgress({
        user_id: user.id,
        course_id: courseIdRef.current,
        step: "content",
        content: contentWithSlides,
        title: courseTitle,
        description: courseDescription || "",
      });

      console.log("Conteúdo com slides salvo:", response);
      toast.success("Conteúdo e slides salvos com sucesso!");
    } catch (error) {
      console.error("Erro no processo de geração de slides:", error);
      toast.error(
        "Erro ao gerar slides: " + (error.message || "Erro desconhecido")
      );
    } finally {
      setIsLoading(false);
      setCurrentStep("completion");
    }
  };

  return (
    <Layout>
      <div className="upload-container">
        <div className="upload-card">
          {currentStep === "upload" && (
            <>
              <UploadHeader />
              <DropZone onFilesSelected={handleFilesSelected} />
              {files.length > 0 && (
                <FileList
                  files={files}
                  onRemove={handleRemoveFile} // Certifique-se que o nome da prop está correto
                />
              )}
              <UploadActions onCancel={handleCancel} onAttach={handleAttach} />
            </>
          )}

          {currentStep === "objectives" && (
            <ObjectivesComponent
              objectives={objectives}
              onChange={setObjectives}
              onBack={() => setCurrentStep("upload")}
              onNext={() => setCurrentStep("syllabus")}
            />
          )}

          {currentStep === "syllabus" && (
            <SyllabusComponent
              syllabus={syllabus}
              onChange={setSyllabus}
              onBack={() => setCurrentStep("objectives")}
              onNext={() => setCurrentStep("content")}
            />
          )}

          {currentStep === "content" && (
            <ContentListComponent
              contentList={contentList}
              onChange={setContentList}
              onBack={() => setCurrentStep("syllabus")}
              onNext={handleContentSubmit}
              isLoading={isLoading}
            />
          )}

          {currentStep === "completion" && (
            <CompletionScreen courseData={courseData} />
          )}

          {isLoading && (
            <div className="loading-overlay">
              <BiLoaderAlt className="loading-icon" />
              <p>Processando...</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default UploadPage;
