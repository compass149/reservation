import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import roomService from "../services/room.service";
import "./RoomSelection.css";

const STORAGE_KEY = "roomSelectionState";

const RoomSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const parseDates = (savedDates) => {
    if (!savedDates || savedDates.length < 2) return [new Date(), new Date()];
    return [new Date(savedDates[0]), new Date(savedDates[1])];
  };

  const savedState = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};

  const initialDates = location.state?.dates 
    ? parseDates(location.state.dates) 
    : savedState.dates 
      ? parseDates(savedState.dates) 
      : [new Date(), new Date()];

  const initialUserCount = location.state?.totalUser || savedState.totalUser || 1;

  const [dates, setDates] = useState(initialDates);
  const [roomList, setRoomList] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [totalUser, setTotalUser] = useState(initialUserCount);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  const isRoomBooked = useCallback((room, dates) => {
    const bookedRooms = []; 
    return bookedRooms.some((bookedRoom) => bookedRoom.roomId === room.id &&
      bookedRoom.checkIn <= dates[1] && bookedRoom.checkOut >= dates[0]);
  }, []);

  const filterRooms = useCallback((rooms, userCount, dates) => {
    const filtered = rooms.filter(
      (room) => room.capacity >= userCount && !isRoomBooked(room, dates)
    );
    setFilteredRooms(filtered);
    if (selectedRoom && !filtered.some((room) => room.id === selectedRoom.id)) {
      setSelectedRoom(null);
    }
  }, [selectedRoom, isRoomBooked]);

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

    if (dates[0] instanceof Date && dates[1] instanceof Date && dates[0] < dates[1]) {
      fetchAvailableRooms();
    }
  }, [dates, totalUser, filterRooms]);

  const handleTotalUserChange = (event) => {
    const count = parseInt(event.target.value, 10);
    setTotalUser(count);
    filterRooms(roomList, count, dates);
  };

  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setErrorMessage("");
  };

  const handleProceedToPayment = () => {
    if (!selectedRoom || !selectedRoom.id) {
      setErrorMessage("방을 선택해 주세요.");
      return;
    }
    if (!(dates[0] instanceof Date && dates[1] instanceof Date && dates[0] < dates[1])) {
      setErrorMessage("체크아웃 날짜는 체크인 날짜 이후여야 합니다.");
      return;
    }

    navigate("/payment", {
      state: {
        room: selectedRoom,
        checkIn: dates[0],
        checkOut: dates[1],
        totalUser: totalUser,
        user: user,
      },
    });
  };

  const handleRoomDetail = (e, roomId) => {
    e.stopPropagation();
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dates: [dates[0].toISOString(), dates[1].toISOString()],
        totalUser
      })
    );
    navigate(`/roomInfo/${roomId}`, {
      state: {
        dates: [dates[0].toISOString(), dates[1].toISOString()],
        totalUser: totalUser,
      },
    });
  };

  return (
    <div className="reservation-page">
      <h1>방 선택</h1>
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
              {room.imageUrls && (
                <div className="room-image">
                  <img src={room.imageUrls} alt={room.name} style={{ width: "200px", height: "auto" }} />
                </div>
              )}
              <div className="room-card-body">
                <p><strong>최대 수용인원:</strong> {room.capacity}명</p>
                <p><strong>설명:</strong> {room.description}</p>
              </div>
              <div className="room-detail-link" style={{ textAlign: "right" }}>
                <span
                  style={{ color: "gray", textDecoration: "underline", cursor: "pointer" }}
                  onClick={(e) => handleRoomDetail(e, room.id)}
                >
                  자세히
                </span>
              </div>
            </div>
          ))
        ) : (
          <p>조건에 맞는 방이 없습니다.</p>
        )}
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}

      <div className="proceed-button">
        <button onClick={handleProceedToPayment}>결제하기로 이동</button>
      </div>
    </div>
  );
};

export default RoomSelection;
