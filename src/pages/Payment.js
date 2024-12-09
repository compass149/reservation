import React from "react";
import { useLocation } from "react-router-dom";

const Payment = () => {
  const location = useLocation();
  const { room, checkIn, checkOut, totalUser, user } = location.state || {};

  const handleConfirmPayment = () => {
    if (!room || !checkIn || !checkOut || totalUser === undefined || !user) {
      alert("잘못된 정보가 있습니다. 다시 확인해주세요.");
      return;
    }

    // 예약 데이터 생성
    const reservationData = {
      roomId: room.id,
      checkIn,
      checkOut,
      totalUser,
      user: user.id,
    };

    // 예약 저장 요청
    // reserveService.saveReservationService(reservationData).then(...);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(new Date(date));
  };

  if (!room) {
    return <div>잘못된 접근입니다. 방을 선택해주세요.</div>;
  }

  return (
    <div className="payment-page">
      <h1>결제 페이지</h1>
      <p>선택한 방: {room.name}</p>
      <p>체크인 날짜: {formatDate(checkIn)}</p>
      <p>체크아웃 날짜: {formatDate(checkOut)}</p>
      <p>예약 인원: {totalUser}</p>
      <p>가격: {totalUser * room.price}원</p>
      <button onClick={handleConfirmPayment}>결제 완료</button>
    </div>
  );
};

export default Payment;
