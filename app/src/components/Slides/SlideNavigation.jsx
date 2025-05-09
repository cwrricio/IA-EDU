import React from "react";
import "./slides.css";

const SlideNavigation = ({
  onPrev,
  onNext,
  canGoPrev = true,
  canGoNext = true,
  currentIndex,
  totalSlides,
  nextText = "Próximo",
  showIndicator = true,
}) => {
  return (
    <>
      {/* Botão de navegação - anterior */}
      {canGoPrev && (
        <button className="nav-button nav-prev" onClick={onPrev}>
          &#10094;
        </button>
      )}

      {/* Botão de navegação - próximo */}
      {canGoNext && (
        <button className="nav-button nav-next" onClick={onNext}>
          &#10095;
          {nextText !== "Próximo" && (
            <span className="button-text">{nextText}</span>
          )}
        </button>
      )}

      {/* Indicador de slide */}
      {showIndicator && (
        <div className="slide-indicator">
          {currentIndex + 1} / {totalSlides}
        </div>
      )}
    </>
  );
};

export default SlideNavigation;
