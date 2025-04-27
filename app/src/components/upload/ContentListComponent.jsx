import { useState, useEffect, useRef } from "react";
import ContentItemComponent from "./ContentItemComponent";
import api from "../../services/api";
import { BiLoaderAlt } from "react-icons/bi";
import "./styles/ContentListComponent.css";

const ContentListComponent = ({ onBack, onContinue, documentAnalysis }) => {
  const [contentItems, setContentItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const apiCallMadeRef = useRef(false);
  const prevDocumentAnalysis = useRef(null);

  // Fetch content based on document analysis when component mounts
  useEffect(() => {
    // Only call API if document changes or first call
    if (documentAnalysis === prevDocumentAnalysis.current) return;
    prevDocumentAnalysis.current = documentAnalysis;
    
    const fetchContent = async () => {
      try {
        setLoading(true);
        
        // Use document content as context if available
        const context = documentAnalysis ||
          "Course on AI applications in education to help teachers utilize technology for enhancing student learning experiences";
        
        const result = await api.generateContent({ context });
        console.log('API response for content:', result);
        
        if (result && result.content_items && Array.isArray(result.content_items)) {
          setContentItems(result.content_items);
        }
      } catch (error) {
        console.error('Error fetching content:', error);
        // Keep default items in case of error
      } finally {
        setLoading(false);
      }
    };
    
    fetchContent();
  }, [documentAnalysis]);

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
              title={item.title}
              description={item.description}
              content={item.content}
              learningObjectives={item.learning_objectives}
              relatedObjectives={item.related_objectives}
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
          onClick={onContinue}
          disabled={loading || contentItems.length === 0}
        >
          Avançar
        </button>
      </div>
    </div>
  );
};

export default ContentListComponent;