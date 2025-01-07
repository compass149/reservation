import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import roomService from "../services/room.service";
import "./RoomSelection.css";
import ImageSlider from "./ImageSlider";
import { BASE_API_URL } from "../common/constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faImage } from "@fortawesome/free-solid-svg-icons";
import ko from "date-fns/locale/ko"; // 한국어 로케일 가져오기

// 한국어 로케일 등록
registerLocale("ko", ko);
const STORAGE_KEY = "roomSelectionState";

const RoomSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // 날짜 배열을 Date 객체로 변환하는 함수
  const parseDates = (savedDates) => {
    if (!savedDates || savedDates.length < 2) return [new Date(), new Date()];
    return [new Date(savedDates[0]), new Date(savedDates[1])];
  };

  // 세션 스토리지에서 기존에 저장된 state 불러오기
  const savedState = JSON.parse(sessionStorage.getItem(STORAGE_KEY)) || {};

  // 체크인/체크아웃 날짜 초기값 설정
  const initialDates = location.state?.dates
    ? parseDates(location.state.dates)
    : savedState.dates
    ? parseDates(savedState.dates)
    : [new Date(), new Date()];

  // 예약 인원 초기값 설정
  const initialUserCount = location.state?.totalUser || savedState.totalUser || 1;

  const [dates, setDates] = useState(initialDates);
  const [roomList, setRoomList] = useState([]);
  const [filteredRooms, setFilteredRooms] = useState([]);
  const [totalUser, setTotalUser] = useState(initialUserCount);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [user, setUser] = useState(null);

  // 로그인 체크
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
    if (!loggedInUser) {
      navigate("/login");
    } else {
      setUser(loggedInUser);
    }
  }, [navigate]);

  // 특정 방이 이미 예약되었는지 여부 판단(데모용 가짜 데이터)
  const isRoomBooked = useCallback((room, dates) => {
    // 실제로는 서버에서 예약현황 받아와야 함
    const bookedRooms = [];
    return bookedRooms.some(
      (bookedRoom) =>
        bookedRoom.roomId === room.id &&
        bookedRoom.checkIn <= dates[1] &&
        bookedRoom.checkOut >= dates[0]
    );
  }, []);

  // 방 필터링(수용 인원 & 예약 여부)
  const filterRooms = useCallback(
    (rooms, userCount, dates) => {
      const filtered = rooms.filter(
        (room) => room.capacity >= userCount && !isRoomBooked(room, dates)
      );
      setFilteredRooms(filtered);

      // 이미 선택된 방이 필터링 대상에서 제외되면 선택 해제
      if (selectedRoom && !filtered.some((r) => r.id === selectedRoom.id)) {
        setSelectedRoom(null);
      }
    },
    [selectedRoom, isRoomBooked]
  );

  // 컴포넌트 마운트 시 방 목록 불러오기 & 필터링
  useEffect(() => {
    const fetchAvailableRooms = async () => {
      try {
        const response = await roomService.getAllRooms(); // 모든 방 정보
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

  // 예약 인원 변경
  const handleTotalUserChange = (event) => {
    const count = parseInt(event.target.value, 10);
    setTotalUser(count);
    filterRooms(roomList, count, dates);
  };

  // 방 선택
  const handleRoomSelect = (room) => {
    setSelectedRoom(room);
    setErrorMessage("");
  };

  // 결제 페이지로 이동 (방, 날짜, 인원 정보 전달)
  const handleProceedToPayment = () => {
    if (!selectedRoom || !selectedRoom.id) {
      setErrorMessage("방을 선택해 주세요.");
      return;
    }
    if (
      !(dates[0] instanceof Date && dates[1] instanceof Date && dates[0] < dates[1])
    ) {
      setErrorMessage("체크아웃 날짜는 체크인 날짜 이후여야 합니다.");
      return;
    }

    // (1) 최종 결제 금액 계산 (ex: 인원수 × 방 가격)
    const finalPrice = Number(totalUser) * Number(selectedRoom.price);

    // (2) Payment 페이지로 이동
    navigate("/payment", {
      state: {
        room: selectedRoom,
        checkIn: dates[0],
        checkOut: dates[1],
        totalUser: totalUser,
        user: user,
        totalAmount: finalPrice,
      },
    });
  };

  // 상세 페이지 이동(방 정보 페이지)
  const handleRoomDetail = (e, roomId) => {
    e.stopPropagation();
    // 나중에 돌아왔을 때 캘린더/인원 정보를 복원하기 위해 세션 스토리지에 저장
    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        dates: [dates[0].toISOString(), dates[1].toISOString()],
        totalUser,
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
      <h3 className="title">📆 체크인 & 체크아웃 날짜 선택 📆</h3>
      <div className="calendar">
        <DatePicker
          locale="ko"
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
        <label htmlFor="user-count">
          <strong>예약 인원 : </strong>
        </label>
        <input
          id="user-count"
          type="number"
          min="1"
          value={totalUser}
          onChange={handleTotalUserChange}
        />
      </div>

      {/* 선택된 방이 있을 때만 '예약하기' 버튼 표시 */}
      <div className="proceed-button" style={{ textAlign: "right", marginRight: "20px" }}>
        {selectedRoom && (
          <button className="btn btn-primary" onClick={handleProceedToPayment}>
            예약하기
          </button>
        )}
      </div>

      <div className="room-list">
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

              <div className="room-image">
                {room.imageUrls && room.imageUrls.length > 0 ? (
                  <ImageSlider
                    imageUrls={room.imageUrls.map(
                      (fileName) => `${BASE_API_URL}/api/room/uploads/${fileName}`
                    )}
                  />
                ) : (
                  <div className="icon-container">
                    <FontAwesomeIcon icon={faImage} className="user-icon" />
                  </div>
                )}
              </div>

              <div className="room-card-body">
                <p style={{ marginTop: "30px" }}>
                  <strong>최대 수용인원:</strong> {room.capacity}명
                </p>
                <p>
                  <strong>설명:</strong> {room.description}
                </p>
              </div>

              <div className="room-detail-link">
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
          <div className="no-rooms-message"></div>
        )}
      </div>

      {errorMessage && <p className="error-message">{errorMessage}</p>}
    </div>
  );
};

export default RoomSelection;
