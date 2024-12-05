import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => (
  <div>
    <h1>예약하기</h1>
    <Link to="/calendar">예약 시작하기</Link>
  </div>
);

export default Home;
