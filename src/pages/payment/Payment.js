// src/pages/user/Payment.js
import React from "react";
import { useLocation } from "react-router-dom";
import PaymentButton from "./PaymentButton"; // PaymentButton 컴포넌트 import
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const { room, checkIn, checkOut, totalUser, user } = location.state || {};

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(new Date(date));
  };

  if (!room || !checkIn || !checkOut || !totalUser) {
    return <div>잘못된 접근입니다. 예약 정보를 확인해주세요.</div>;
  }

  // 결제 정보 설정
  const reservationData = {
    roomId: room.id, // `Rooms` 엔티티 ID
    userId: user?.uid || "guest", // `User` 엔티티 UID
    checkIn, // 체크인 날짜
    checkOut, // 체크아웃 날짜
    totalUser, // 예약 인원
    itemName: room.roomName, // 방 이름 (`Rooms.roomName`)
    totalAmount: totalUser * room.pricePerNight, // 가격 계산
  };

  return (
    <div className="payment-page">
      <h1>결제 페이지</h1>
      <p>선택한 방: {room.roomName}</p>
      <p>체크인 날짜: {formatDate(checkIn)}</p>
      <p>체크아웃 날짜: {formatDate(checkOut)}</p>
      <p>예약 인원: {totalUser}</p>
      <p>가격: {reservationData.totalAmount}원</p>
      {/* PaymentButton 컴포넌트에 데이터 전달 */}
      <PaymentButton reservationData={reservationData} />
    </div>
  );
};

export default Payment;
