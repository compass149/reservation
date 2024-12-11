import React, { useState } from "react";
import "./ImageSlider.css";

const ImageSlider = ({ imageUrls, onImageClick, showArrows = false }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  if (!imageUrls || imageUrls.length === 0) {
    return <div>이미지가 없습니다.</div>;
  }

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? imageUrls.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prevIndex) =>
      prevIndex === imageUrls.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleImageClick = () => {
    if (onImageClick) {
      onImageClick(currentIndex);
    }
  };

  return (
    <div className="slider-container">
      <img
        src={imageUrls[currentIndex]}
        alt={`image-${currentIndex}`}
        className="slider-image"
        onClick={handleImageClick}
        style={{ cursor: "pointer" }}
      />
      {showArrows && imageUrls.length > 1 && (
        <>
          <button onClick={handlePrev} className="slider-button slider-button--prev">
            ◀
          </button>
          <button onClick={handleNext} className="slider-button slider-button--next">
            ▶
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
