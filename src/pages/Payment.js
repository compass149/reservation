import React from "react";
import { useLocation, useNavigate } from "react-router-dom"; // useNavigate 추가
import reserveService from "../services/reserve.service"; 
import "./Payment.css"

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();  // useNavigate 훅 사용
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
      user: user.uid, // 사용자 ID
      status: "대기", // 상태를 PENDING으로 설정
    };
  
    // 예약 저장 요청 (예약 서비스 호출 예시)
    reserveService.saveReservationService(reservationData)
      .then((response) => {
        console.log("예약이 완료되었습니다:", response.data);
        // 예약 완료 후 프로필 페이지로 이동
        navigate("/profile");
      })
      .catch((error) => {
        console.error("예약 중 오류가 발생했습니다:", error);
      });
  };

  const formatDate = (date) => {
    const options = { year: "numeric", month: "long", day: "numeric", weekday: "short" };
    const formatter = new Intl.DateTimeFormat("ko-KR", options);
  
    const parts = formatter.formatToParts(new Date(date));
    let formattedDate = "";
    let weekday = "";
  
    parts.forEach((part) => {
      if (part.type === "weekday") {
        weekday = part.value; // 요일만 추출
      } else {
        formattedDate += part.value; // 날짜 부분 조합
      }
    });
  
    return `${formattedDate} (${weekday})`;
  };
  if (!room) {
    return <div>잘못된 접근입니다. 방을 선택해주세요.</div>;
  }

  return (
    <div className="payment-page">
      <div className="payment-card">
      <h1 className="payment-title">결제 페이지</h1>
      <p><strong>선택한 방</strong>: {room.name}</p>
      <p><strong>체크인</strong>: {formatDate(checkIn)}</p>
      <p><strong>체크아웃</strong>: {formatDate(checkOut)}</p>
      <p><strong>예약 인원</strong>: {totalUser}</p>
      <p><strong>가격</strong>: {totalUser * room.price}원</p>
      <button className="btn btn-primary" onClick={handleConfirmPayment}>결제하기</button>
    </div>
    </div>
  );
};

export default Payment;
