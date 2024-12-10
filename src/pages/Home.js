import React from 'react';
import { Link } from 'react-router-dom';  // react-router-dom 사용
import './Home.css';  // 스타일을 위한 CSS 파일을 따로 분리
import RoomSelection from './RoomSelection';

export default function Home() {
  return (
    <div className="container">
      <h1 className="title">예약</h1>
      <Link to="/roomSelection">  {/* react-router-dom Link로 페이지 이동 */}
        <button className="btn btn-primary">예약하러 가기</button>
      </Link>
    </div>
  );
}
