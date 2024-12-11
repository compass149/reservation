import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import roomService from '../services/room.service';
import { BASE_API_URL } from "../common/constants";
import ImageSlider from "./ImageSlider";
import ImageCarouselModal from "./ImageCarouselModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage, faUsers, faBed } from "@fortawesome/free-solid-svg-icons";
import "./RoomInfo.css";

const RoomInfo = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalStartIndex, setModalStartIndex] = useState(0);

  useEffect(() => {
    roomService.getRoomById(id)
      .then(response => {
        setRoom(response.data);
      })
      .catch(err => {
        console.error(err);
        setError('방 정보를 가져오는 데 실패했습니다.');
      });
  }, [id]);

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (!room) {
    return (
      <div className="container mt-5 d-flex justify-content-center align-items-center" style={{height: '50vh'}}>
        <div className="spinner-border" role="status"><span className="visually-hidden">로딩 중...</span></div>
      </div>
    );
  }

  const imageUrls = room.imageUrls && room.imageUrls.length > 0
    ? room.imageUrls.map(fileName => `${BASE_API_URL}/api/room/uploads/${fileName}`)
    : [];

  const handleImageClick = (index) => {
    setModalStartIndex(index);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="room-info-container">
      <div className="hero-section position-relative">
        {imageUrls.length > 0 ? (
          <ImageSlider
            className="hero-section"
            imageUrls={imageUrls}
            onImageClick={handleImageClick}
            showArrows={true}  // RoomInfo에서만 화살표 표시
          />
        ) : (
          <div className="no-image-hero d-flex justify-content-center align-items-center">
            <FontAwesomeIcon icon={faImage} className="no-image-icon" />
          </div>
        )}
        <div className="hero-overlay d-flex flex-column justify-content-end p-4">
          <h1 className="text-white fw-bold display-6 mb-1">{room.name}</h1>
          <span className="text-white fw-bold fs-5">
            <FontAwesomeIcon icon={faBed} className="me-2" />
            {room.price.toLocaleString()}원 / 1박
          </span>
        </div>
      </div>
      
      <div className="container mt-4">
        <div className="card shadow-sm">
          <div className="card-body p-4">
            <div className="d-flex mb-3">
              <div className="me-3 text-secondary">
                <FontAwesomeIcon icon={faUsers} className="me-2"/>
                최대 {room.capacity}명
              </div>
              <div className="text-secondary">
                <FontAwesomeIcon icon={faBed} className="me-2"/>
                {room.price.toLocaleString()}원 / 1박
              </div>
            </div>
            <p className="text-muted mb-4">{room.description}</p>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <ImageCarouselModal
          imageUrls={imageUrls}
          initialIndex={modalStartIndex}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default RoomInfo;
