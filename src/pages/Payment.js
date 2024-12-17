import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, checkIn, checkOut, totalUser, user } = location.state || {};

  const handleKakaoPay = async () => {
    const token = localStorage.getItem("jwtToken");
    axios.get("http://localhost:8082/api/room", {
      headers: {
        Authorization: `Bearer ${token}`, // JWT 토큰 추가
      },
    });
    
    if (!token) {
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      window.location.href = "/login";
      return;
    }
  
    try {
      const paymentData = {
        orderId: `ORDER_${new Date().getTime()}`,
        userId: user.uid,
        itemName: room.roomName,
        quantity: totalUser,
        totalAmount: totalUser * room.pricePerNight,
      };
  
      console.log("결제 준비 데이터:", paymentData);
  
      const response = await axios.post("http://localhost:8082/api/payment/ready", paymentData, {
        headers: {
          Authorization: `Bearer ${token}`, // 올바른 JWT 토큰 추가
          "Content-Type": "application/json",
        },
      });
  
      const { next_redirect_pc_url } = response.data;
      window.location.href = next_redirect_pc_url;
    } catch (error) {
      console.error("결제 준비 중 오류 발생:", error);
      alert("결제 준비 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
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
        <p><strong>예약 인원</strong>: {totalUser}명</p>
        <p><strong>가격</strong>: {totalUser * room.price}원</p>
        <button className="btn btn-primary" onClick={handleKakaoPay}>
          카카오페이 결제하기
        </button>
      </div>
    </div>
  );
};

export default Payment;
