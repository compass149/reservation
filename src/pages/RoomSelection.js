import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./RoomSelection.css";

import roomService from "../services/room.service"; // API 호출용 서비스

const RoomSelection = () => {
  const [dates, setDates] = useState([new Date(), new Date()]);
  const [roomList, setRoomList] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]); // 필터링된 방 목록
  const [totalUsers, setTotalUsers] = useState(1); // 예약 인원
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // 방 목록 불러오기
    roomService
      .getAllRooms()
      .then((response) => {
        setRoomList(response.data);
        setFilteredRooms(response.data); // 초기 상태는 모든 방 표시
      })
      .catch((error) => console.error("방 목록 불러오기 오류:", error));
  }, []);

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setErrorMessage(""); // 오류 메시지 초기화
  };

  const handleTotalUsersChange = (event) => {
    const count = parseInt(event.target.value, 10);
    setTotalUsers(count);

    // 인원수에 맞게 방 목록 필터링
    const filtered = roomList.filter((room) => room.capacity >= count);
    setFilteredRooms(filtered);

    // 선택한 방 초기화 (필터링 후 이전 선택한 방이 없어질 수 있음)
    if (selectedRoom && !filtered.some((room) => room.id === selectedRoom.id)) {
      setSelectedRoom(null);
    }
  };

  const handleProceedToPayment = () => {
    if (!selectedRoom || !selectedRoom.id) { // selectedRoom 객체가 유효한지 체크
      setErrorMessage("방을 선택해 주세요.");
      return;
    }
    if (dates[0] >= dates[1]) {
      setErrorMessage("체크아웃 날짜는 체크인 날짜 이후여야 합니다.");
      return;
    }
  
    // 결제 페이지로 이동
    navigate("/payment", {
      state: {
        room: selectedRoom,
        checkIn: dates[0],
        checkOut: dates[1],
      },
    });
  };

  return (
    <div className="reservation-page">
      <h1>방 선택</h1>

      {/* 날짜 선택 */}
      <div className="calendar">
        <DatePicker
          selected={dates[0]}
          onChange={(updatedDates) => setDates(updatedDates)}
          startDate={dates[0]}
          endDate={dates[1]}
          selectsRange
          inline
          dateFormat="yyyy/MM/dd"
          placeholderText="체크인/체크아웃 날짜 선택"
        />
      </div>

         {/* 인원 선택 */}
         <div className="user-count">
        <label htmlFor="user-count">예약 인원: </label>
        <input
          id="user-count"
          type="number"
          min="1"
          value={totalUsers}
          onChange={handleTotalUsersChange}
        />
      </div>

{/* 방 목록 */}
<div className="room-list">
  <h2>방 목록</h2>
  {filteredRooms.length > 0 ? (
    filteredRooms.map((room) => (
      <div
        key={room.id}
        className={`room-card ${selectedRoom?.id === room.id ? "selected" : ""}`}
        onClick={() => handleRoomSelect(room)}
      >
        <div className="room-card-header">
          <h3>{room.name}</h3>
          <p className="room-price">{room.price.toLocaleString()}원</p>
        </div>
        <div className="room-card-body">
          <p><strong>최대 수용인원:</strong> {room.capacity}명</p>
          <p><strong>설명:</strong> {room.description}</p>
        </div>
      </div>
    ))
  ) : (
    <p>조건에 맞는 방이 없습니다.</p>
  )}
</div>


      {/* 오류 메시지 */}
      {errorMessage && <p className="error-message">{errorMessage}</p>}

      {/* 결제 이동 버튼 */}
      <div className="proceed-button">
        <button onClick={handleProceedToPayment}>결제하기로 이동</button>
      </div>
    </div>
  );
};

export default RoomSelection;