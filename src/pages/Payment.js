import React from "react";
import { useLocation } from "react-router-dom";
import reserveService from "../services/reserve.service"; 

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
      user: user.id, // 사용자 ID
      status: "대기", // 상태를 PENDING으로 설정
    };
  
    // 예약 저장 요청 (예약 서비스 호출 예시)
    reserveService.saveReservationService(reservationData)
      .then((response) => {
        console.log("예약이 완료되었습니다:", response.data);
        // 추가적으로 예약 완료 후 처리할 사항이 있으면 여기에 추가
      })
      .catch((error) => {
        console.error("예약 중 오류가 발생했습니다:", error);
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
      <p>예약 인원: {totalUser}</p>
      <p>가격: {totalUser * room.price}원</p>
      <button onClick={handleConfirmPayment}>결제 완료</button>
    </div>
  );
};

export default Payment;
