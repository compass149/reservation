import React from "react";
import { useLocation } from "react-router-dom";
import PaymentButton from "./PaymentButton";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const { room, checkIn, checkOut, totalUser, user } = location.state || {};

  // 날짜 포맷팅 함수
  const formatDate = (date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(new Date(date)); // 항상 Date 객체로 변환 후 포맷팅
  };

  // 필수 데이터가 없을 경우
  if (!room || !checkIn || !checkOut || !totalUser) {
    return <div>잘못된 접근입니다. 예약 정보를 확인해주세요.</div>;
  }

  // 결제 정보 설정
  const reservationData = {
    agent: "pc", // 디바이스 타입
    openType: "popup", // 결제창 타입
    roomId: room.id,
    userId: user?.uid || "guest",
    checkIn: formatDate(checkIn), // 문자열로 변환
    checkOut: formatDate(checkOut), // 문자열로 변환
    totalUser,
    itemName: room.roomName,
    totalAmount: totalUser * room.pricePerNight,
  };

  return (
    <div className="payment-page">
      <h1>결제 페이지</h1>
      <p>선택한 방: {room.roomName}</p>
      <p>체크인 날짜: {reservationData.checkIn}</p>
      <p>체크아웃 날짜: {reservationData.checkOut}</p>
      <p>예약 인원: {totalUser}</p>
      <p>가격: {reservationData.totalAmount}원</p>
      <PaymentButton reservationData={reservationData} />
    </div>
  );
};

export default Payment;
