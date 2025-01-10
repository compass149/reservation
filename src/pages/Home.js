import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';  
import RoomSelection from './RoomSelection';
// 이미지 파일 import
import fotoaibeImg from '../assets/img/pexels-fotoaibe-1669799.jpg'; 
import homeImg from '../assets/img/home-1680800_1280.jpg'; 
import pixabayImg from '../assets/img/pexels-pixabay-271624.jpg'; 

export default function Home() {
  return (
    <div className="container">
      <div className="image-container">
        {/* 올바르게 수정된 이미지 경로 */}
        <img 
          src={fotoaibeImg} 
          alt="첫 번째 이미지" 
          className="home-img" 
        />
        {/* 다른 이미지가 src/assets/img에 없으면 경로를 수정하거나 import */}
        <img 
          src={homeImg}
          alt="두 번째 이미지" 
          className="home-img" 
        />
        <img 
          src={pixabayImg} 
          alt="세 번째 이미지" 
          className="home-img" 
        />
      </div>

      <h1 className="title">🗓️예약🗓️</h1>
      <Link to="/roomSelection">
        <button className="btn btn-primary">예약하러 가기</button>
      </Link>
    </div>
  );
}
