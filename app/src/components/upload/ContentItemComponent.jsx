import { useState } from "react";
import { VscChevronDown, VscChevronUp } from "react-icons/vsc";
import "./styles/ContentItemComponent.css";

const ContentItemComponent = ({ 
  title, 
  description, 
  content, 
  learningObjectives, 
  relatedObjectives 
}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    setExpanded(!expanded);
  };

  return (
    <div className={`content-item ${expanded ? 'expanded' : ''}`}>
      <div className="content-item-header" onClick={toggleExpand}>
        <div className="content-item-title-container">
          <h3 className="content-item-title">{title}</h3>
          <p className="content-item-description">{description}</p>
        </div>
        <div className="content-item-toggle">
          {expanded ? <VscChevronUp size={20} /> : <VscChevronDown size={20} />}
        </div>
      </div>
      
      {expanded && (
        <div className="content-item-details">
          <div className="content-item-content">
            <div dangerouslySetInnerHTML={{ __html: content || "Conteúdo detalhado será carregado aqui." }} />
            
            {learningObjectives && learningObjectives.length > 0 && (
              <div className="content-item-objectives">
                <h4 className="content-item-section-title">Objetivos de Aprendizagem</h4>
                <ul className="content-item-objectives-list">
                  {learningObjectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            )}
            
            {relatedObjectives && relatedObjectives.length > 0 && (
              <div className="content-item-related">
                <h4 className="content-item-section-title">Objetivos Específicos Relacionados</h4>
                <ul className="content-item-related-list">
                  {relatedObjectives.map((objective, index) => (
                    <li key={index}>{objective}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentItemComponent;