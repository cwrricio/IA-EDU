import { useState, useEffect, useRef } from "react";
import ContentItemComponent from "./ContentItemComponent";
import api from "../../services/api";
import { BiLoaderAlt } from "react-icons/bi";
import "./styles/ContentListComponent.css";

const ContentListComponent = ({ onBack, onContinue, documentAnalysis, savedData }) => {
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const contentItemsRef = useRef({});
  
  // Adicionar esta linha para resolver o erro
  const prevDocumentAnalysis = useRef(null);

  // Registrar os dados completos de cada item
  const registerContentItem = (id, getContentFn) => {
    contentItemsRef.current[id] = getContentFn;
  };

  // Simplificar a função getCompleteContentData
  const getCompleteContentData = () => {
    return {
      content_items: contentItems.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description,
        // Apenas incluir campos adicionais se existirem
        ...(item.content && { content: item.content }),
        ...(item.learning_objectives && { learning_objectives: item.learning_objectives }),
        ...(item.related_objectives && { related_objectives: item.related_objectives })
      }))
    };
  };

  const handleContinue = () => {
    const completeData = getCompleteContentData();
    console.log("Dados completos sendo enviados:", completeData);
    onContinue(completeData);
  };

  // useEffect para carregar dados existentes ou gerar novos
  useEffect(() => {
    // Se temos dados salvos, use-os em vez de chamar a API
    if (savedData && savedData.content_items && Array.isArray(savedData.content_items)) {
      setContentItems(savedData.content_items);
      return; // Saia do useEffect sem chamar a API
    }

    // Only call API if document changes or first call
    if (documentAnalysis === prevDocumentAnalysis.current) return;
    prevDocumentAnalysis.current = documentAnalysis;

    // Modifique a função fetchContent para gerar dados completos

    const fetchContent = async () => {
      try {
        setLoading(true);

        // Use document content as context if available
        const context = documentAnalysis ||
          "Course on AI applications in education to help teachers utilize technology for enhancing student learning experiences";

        const result = await api.generateContent({ context });
        console.log('API response for content:', result);

        if (result && result.content_items && Array.isArray(result.content_items)) {
          // Enriqueça os itens com campos vazios para os dados detalhados
          const enrichedItems = result.content_items.map(item => ({
            ...item,
            content: item.content || "",
            learning_objectives: item.learning_objectives || [],
            related_objectives: item.related_objectives || []
          }));
          setContentItems(enrichedItems);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        // Keep default items in case of error
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, [documentAnalysis, savedData]);

  return (
    <div className="content-list-container">
      <h2 className="content-list-title">Conteúdo do Plano de Ensino</h2>

      {loading ? (
        <div className="content-loading">
          <BiLoaderAlt className="spin-animation" size={30} />
          <p>Gerando conteúdo baseado no seu documento...</p>
        </div>
      ) : (
        <div className="content-list">
          {contentItems.map(item => (
            <ContentItemComponent
              key={item.id}
              id={item.id}
              title={item.title}
              description={item.description}
              content={item.content}
              learningObjectives={item.learning_objectives}
              relatedObjectives={item.related_objectives}
              onContentReady={registerContentItem}
            />
          ))}
        </div>
      )}

      <div className="content-list-actions">
        <button className="content-list-back-btn" onClick={onBack}>
          Voltar
        </button>
        <button
          className="content-list-continue-btn"
          onClick={handleContinue}
          disabled={loading || contentItems.length === 0}
        >
          Avançar
        </button>
      </div>
    </div>
  );
};

export default ContentListComponent;