import { useState } from "react";
import { VscChevronDown, VscChevronUp } from "react-icons/vsc";
import "./styles/ContentItemComponent.css";

const ContentItemComponent = ({ title, description, content }) => {
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
            {content || "Conteúdo detalhado será carregado aqui."}
          </div>
        </div>
      )}
    </div>
  );
};

export default ContentItemComponent;