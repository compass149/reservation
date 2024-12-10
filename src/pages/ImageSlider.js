import React, { useState } from "react";
import "./ImageSlider.css"

const ImageSlider = ({ imageUrls }) => {
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

  const sliderContainerStyle = {
    position: "relative",
    width: "300px",
    height: "250px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "transparent",
  };

  const buttonStyle = {
    position: "absolute",
    top: "50%",
    transform: "translateY(-50%)",
    background: "none",
    border: "none",
    color: "#11333333",
    cursor: "pointer",
    fontSize: "24px",
    zIndex: 2, // 버튼이 항상 위에 표시되도록
  };

  const prevButtonStyle = {
    ...buttonStyle,
    left: "-7px", // 이미지의 왼쪽 근처에 위치
  };

  const nextButtonStyle = {
    ...buttonStyle,
    right: "-7px", // 이미지의 오른쪽 근처에 위치
  };

  const imageStyle = {
    maxWidth: "100%",
    maxHeight: "100%",
    objectFit: "contain",
  };

  return (
    <div style={sliderContainerStyle}>
      <img
        src={imageUrls[currentIndex]}
        alt={`image-${currentIndex}`}
        style={imageStyle}
      />
      {imageUrls.length > 1 && (
        <>
          <button onClick={handlePrev} style={prevButtonStyle}>
            ◀
          </button>
          <button onClick={handleNext} style={nextButtonStyle}>
            ▶
          </button>
        </>
      )}
    </div>
  );
};

export default ImageSlider;
