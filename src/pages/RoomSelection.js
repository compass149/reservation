import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { reserveRoom } from "../../store/actions/reservationActions";
import Calendar from "react-calendar"; // 달력 컴포넌트 라이브러리
import 'react-calendar/dist/Calendar.css';
import './ReservationPage.css';

const RoomSelection = () => {
    const [dates, setDates] = useState([new Date()]);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const user = useSelector(state => state.user);
  
    const dispatch = useDispatch();
  
    const handleDateChange = (dates) => {
      setDates(dates);
    };
  
    const handleRoomSelect = (room) => {
      setSelectedRoom(room);
    };
  
    const handleReserve = () => {
      if (!user) {
        setErrorMessage("로그인 후 예약이 가능합니다.");
        return;
      }
      if (!selectedRoom) {
        setErrorMessage("방을 선택해 주세요.");
        return;
      }
  
      // 예약 데이터 저장
      const reservationData = {
        userId: user.id,
        roomId: selectedRoom.id,
        checkIn: dates[0],
        checkOut: dates[1],
      };
  
      dispatch(reserveRoom(reservationData));
    };
  
    return (
      <div className="reservation-page">
        <h1>게스트하우스 예약</h1>
  
        <div className="calendar">
          <Calendar
            onChange={handleDateChange}
            value={dates}
            selectRange={true}
          />
        </div>
  
        <div className="room-selection">
          <h2>방 선택</h2>
          {/* 예시 방 목록 */}
          {["남자 전용", "여자 전용", "혼성"].map((room, index) => (
            <button key={index} onClick={() => handleRoomSelect({ id: index + 1, name: room })}>
              {room}
            </button>
          ))}
        </div>
  
        <div className="reserve-button">
          <button onClick={handleReserve}>예약하기</button>
        </div>
  
        {errorMessage && <div className="error-message">{errorMessage}</div>}
      </div>
    );
  };

export default RoomSelection;