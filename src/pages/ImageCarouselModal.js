import React, { useState, useEffect } from "react";
import "./ImageCarouselModal.css";

const ImageCarouselModal = ({ imageUrls, initialIndex, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex || 0);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    // cleanup 함수에서 이벤트 제거
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose}>
          ×
        </button>
        <div className="modal-carousel-container">
          <img
            src={imageUrls[currentIndex]}
            alt={`image-${currentIndex}`}
            className="modal-carousel-image"
          />
          {imageUrls.length > 1 && (
            <>
              <button
                className="modal-carousel-button modal-carousel-button--prev"
                onClick={handlePrev}
              >
                ◀
              </button>
              <button
                className="modal-carousel-button modal-carousel-button--next"
                onClick={handleNext}
              >
                ▶
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageCarouselModal;
