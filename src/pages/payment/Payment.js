import React from "react";
import { useLocation } from "react-router-dom";
import PaymentButton from "./PaymentButton";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  // RoomSelection에서 넘어온 값을 구조분해 할당
  const { room, checkIn, checkOut, totalUser, user, totalAmount } = location.state || {};

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(new Date(date));
  };

  // 필수 데이터가 없으면 에러
  if (!room || !checkIn || !checkOut || !totalUser) {
    return <div>잘못된 접근입니다. 예약 정보를 확인해주세요.</div>;
  }

  // (예시) 실제 결제창에 들어갈 정보
  const reservationData = {
    agent: "pc", // PC/모바일 여부(하드코딩 예시)
    openType: "popup", // 팝업/리다이렉트 등
    roomId: room.id,
    userId: user?.uid || "guest",
    checkIn: formatDate(checkIn),
    checkOut: formatDate(checkOut),
    totalUser: totalUser,
    itemName: room.name,
    totalAmount: totalAmount,
     // 서버에서 예약번호(rsvId)를 받은 경우 여기에 넣으면 됨
  };

  return (
    <div className="payment-page">
      <h1>결제 페이지</h1>
      {/* 표 형태로 예약 정보 표시 */}
      <table className="payment-table">
        <thead>
          <tr>
            <th>항목</th>
            <th>내용</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>방 이름</td>
            <td>{room.name}</td>
          </tr>
          <tr>
            <td>체크인 날짜</td>
            <td>{formatDate(checkIn)}</td>
          </tr>
          <tr>
            <td>체크아웃 날짜</td>
            <td>{formatDate(checkOut)}</td>
          </tr>
          <tr>
            <td>예약 인원</td>
            <td>{totalUser}명</td>
          </tr>
          <tr>
            <td>가격</td>
            <td>{totalAmount.toLocaleString()}원</td>
          </tr>
        </tbody>
      </table>

      {/* 결제 버튼 */}
      <div style={{ marginTop: "20px" }}>
        <PaymentButton reservationData={reservationData} />
      </div>
    </div>
  );
};

export default Payment;
