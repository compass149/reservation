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
  const [totalUser, setTotalUser] = useState(1); // 예약 인원
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null); // 로그인한 사용자 정보
  const navigate = useNavigate();

  // 로그인된 사용자의 정보를 가져오는 코드 (예시)
  useEffect(() => {
    const loggedInUser = { id: 1, username: "user123" }; // 예시로 가정한 사용자
    setUser(loggedInUser);
  }, []);

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

  const isRoomBooked = (room, dates) => {
    const bookedRooms = []; // 이미 예약된 방 목록을 가져오는 API 로직
    return bookedRooms.some((bookedRoom) => 
      bookedRoom.roomId === room.id && 
      ((bookedRoom.checkIn <= dates[1] && bookedRoom.checkOut >= dates[0])) 
    );
  };

  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await roomService.getAllRooms();
        setRoomList(response.data);
        filterRooms(response.data, totalUser, dates);
      } catch (error) {
        console.error("방 목록 불러오기 오류:", error);
      }
    };

    if (dates[0] < dates[1]) {
      fetchAvailableRooms();
    }
  }, [dates, totalUser, filterRooms]);

  const handleTotalUserChange = (event) => {
    const count = parseInt(event.target.value, 10);
    setTotalUser(count);
    filterRooms(roomList, count, dates); // 필터링 호출
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setErrorMessage(""); // 오류 메시지 초기화
  };

  const handleProceedToPayment = () => {
    if (!selectedRoom || !selectedRoom.id) {
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
        totalUser: totalUser,
        user: user, // 로그인한 사용자 정보 전달
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
          value={totalUser}
          onChange={handleTotalUserChange}
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