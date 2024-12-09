import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import roomService from "../services/room.service"; // API 호출용 서비스
import "./RoomSelection.css";

const RoomSelection = () => {
  const [dates, setDates] = useState([new Date(), new Date()]);
  const [roomList, setRoomList] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]); // 필터링된 방 목록
  const [totalUsers, setTotalUsers] = useState(1); // 예약 인원
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  // 방 필터링 로직을 useCallback으로 감싸기
  const filterRooms = useCallback(
    (rooms, userCount, dates) => {
      // 예약된 방 필터링
      const filtered = rooms.filter((room) => room.capacity >= userCount && !isRoomBooked(room, dates));
      setFilteredRooms(filtered);

      // 선택한 방 초기화 (필터링 후 이전 선택한 방이 없어질 수 있음)
      if (selectedRoom && !filtered.some((room) => room.id === selectedRoom.id)) {
        setSelectedRoom(null);
      }
    },
    [selectedRoom]
  );

  // 방이 예약된 방인지 체크하는 함수
  const isRoomBooked = (room, dates) => {
    // 여기서는 예약된 방 목록을 가져와서 확인하는 방식으로 처리합니다.
    const bookedRooms = []; // 이미 예약된 방 목록을 가져오는 API 로직
    return bookedRooms.some((bookedRoom) => 
      bookedRoom.roomId === room.id && 
      ((bookedRoom.checkIn <= dates[1] && bookedRoom.checkOut >= dates[0])) // 날짜가 겹치는지 확인
    );
  };

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        // 예약된 방 포함한 모든 방 목록을 가져옵니다.
        const response = await roomService.getAllRooms(); // 예약된 방 정보도 포함된 API 호출
        setRoomList(response.data);
        filterRooms(response.data, totalUsers, dates); // 필터링 호출
      } catch (error) {
        console.error("방 목록 불러오기 오류:", error);
      }
    };

    if (dates[0] < dates[1]) {
      fetchAvailableRooms();
    }
  }, [dates, totalUsers, filterRooms]); // dates, totalUsers, filterRooms 의존성 추가

  const handleTotalUsersChange = (event) => {
    const count = parseInt(event.target.value, 10);
    setTotalUsers(count);
    filterRooms(roomList, count, dates); // 필터링 호출
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setErrorMessage(""); // 오류 메시지 초기화
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