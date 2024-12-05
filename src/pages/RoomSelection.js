import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import DatePicker from "react-datepicker"; // react-datepicker 임포트
import "react-datepicker/dist/react-datepicker.css"; // 스타일 임포트
import './RoomSelection.css';
import { reserveRoom } from "../store/actions/reserveRoom";
import {ko} from "date-fns/esm/locale";

const RoomSelection = () => {
  const [dates, setDates] = useState([new Date(), new Date()]); // 체크인, 체크아웃 날짜 배열
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const user = useSelector(state => state.user);

  const dispatch = useDispatch();

  const handleDateChange = (dates) => {
    setDates(dates);
    console.log("선택된 날짜:", dates); // 선택된 날짜를 콘솔에 출력
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
    <div className="roomSelection">
      <h1>예약</h1>

      <div className="calendar">
        {/* DatePicker로 교체 */}
        <DatePicker
          locale={ko}
          selected={dates[0]} // 체크인 날짜
          onChange={handleDateChange} // 날짜 변경 처리
          startDate={dates[0]} // 체크인 날짜
          endDate={dates[1]} // 체크아웃 날짜
          selectsRange // 범위 선택 가능
          inline // 달력을 인라인으로 표시
          dateFormat="yyyy/MM/dd" // 날짜 형식
          placeholderText="체크인 / 체크아웃 날짜 선택"
          
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