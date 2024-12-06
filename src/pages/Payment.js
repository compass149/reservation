import React from "react";
import { useLocation } from "react-router-dom";
import reserveService from "../services/reserve.service";

const Payment = () => {
  const location = useLocation();
  const { room, checkIn, checkOut } = location.state || {};

  const handleConfirmPayment = () => {
    // 예약 데이터 생성
    const reservationData = {
      roomId: room.id,
      checkIn,
      checkOut,
    };

    // 예약 저장 요청
    reserveService
      .saveReservationService(reservationData)
      .then(() => {
        alert("결제가 완료되었습니다. 예약이 확인되었습니다.");
        // 추가적인 결제 성공 처리 로직
      })
      .catch((err) => {
        console.error(err);
        alert("결제 중 오류가 발생했습니다.");
      });
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
      <p>가격: {room.price}원</p>
      <button onClick={handleConfirmPayment}>결제 완료</button>
    </div>
  );
};

export default Payment;
