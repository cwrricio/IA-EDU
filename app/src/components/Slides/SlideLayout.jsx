import React from "react";

// Layout padrão para todos os slides
const SlideLayout = ({ trilha, children }) => (
  <div className="slide-content-wrapper">
    <div className="slide-header">
      {/* Logo deve aparecer apenas aqui */}
      <div className="slide-logo">
        <img src="/mentor.svg" alt="MentorIA" />
      </div>
      <h3 className="slide-trilha">{trilha}</h3>
    </div>
    {children}
  </div>
);

export default SlideLayout;
