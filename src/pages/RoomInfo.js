// src/pages/RoomInfo.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import roomService from '../services/room.service';

const RoomInfo = () => {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

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
    return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  }

  if (!room) {
    return <div className="container mt-5"><p>로딩 중...</p></div>;
  }

  const images = room.images || []; // room.images가 이미지 배열이라고 가정

  const prevImage = () => {
    setCurrentIndex((prevIndex) => prevIndex === 0 ? images.length - 1 : prevIndex - 1);
  };

  const nextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  };

  return (
    <div className="container mt-5">
      <h2>{room.name}</h2>
      <p>최대 수용 인원: {room.capacity}명</p>
      <p>가격: {room.price}원</p>
      <p>설명: {room.description}</p>

      {images.length > 0 && (
        <div className="image-slider" style={{ position: 'relative', width: '300px', height: '200px' }}>
          <div style={{ textAlign: 'center' }}>
            <img src={images[currentIndex]} alt="Room" style={{ width: '100%', height: 'auto' }} />
          </div>
          <button style={{ position: 'absolute', left: 0, top: '50%' }} onClick={prevImage}>‹</button>
          <button style={{ position: 'absolute', right: 0, top: '50%' }} onClick={nextImage}>›</button>
        </div>
      )}
    </div>
  );
};

export default RoomInfo;