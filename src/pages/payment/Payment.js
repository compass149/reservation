// src/pages/user/Payment.js
import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import { readyPayment } from "../../services/paymentService"; 
import "./Payment.css"

// Payment.js에서 사용했던 reserveService는 결제 승인 후에 사용하므로 여기서는 제거하거나, 
// 결제 승인 단계에서 사용하도록 별도의 Success 페이지에서 처리할 수 있습니다.
// import reserveService from "../../services/reserve.service"; 

const Payment = () => {
  const location = useLocation();
  const { room, checkIn, checkOut, totalUser, user } = location.state || {};
  const [loading, setLoading] = useState(false);

  const formatDate = (date) => {
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(new Date(date));
  };

  const handleConfirmPayment = async () => {
    if (!room || !checkIn || !checkOut || totalUser === undefined || !user) {
      alert("잘못된 정보가 있습니다. 다시 확인해주세요.");
      return;
    }

    // 결제를 위한 정보 설정
    const orderId = "order_" + new Date().getTime();    // 실제로는 서버에서 생성한 주문 ID 사용 권장
    const userId = user.uid;                            // 유저 ID
    const itemName = room.name;                         // 상품명
    const quantity = totalUser;                         // 수량(예약 인원)
    const totalAmount = totalUser * room.price;         // 총 결제금액

    setLoading(true);
    try {
      // 카카오페이 결제 준비 API 호출
      const data = await readyPayment(orderId, userId, itemName, quantity, totalAmount);
      // data 예: { next_redirect_pc_url: "...", tid: "..." }

      // 결제 승인 시 필요한 tid와 주문정보를 추후 결제 승인 페이지에서 사용하기 위해 브라우저 저장
      sessionStorage.setItem("reservationInfo", JSON.stringify({ 
        roomId: room.id,
        checkIn,
        checkOut,
        totalUser,
        user: user.uid,
        status: "대기",
        orderId,
        tid: data.tid
      }));

      // 카카오페이 결제창으로 리다이렉트
      window.location.href = data.next_redirect_pc_url;
    } catch (error) {
      console.error("결제 준비 중 오류가 발생했습니다:", error);
      alert("결제 준비 중 문제가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setLoading(false);
    }
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
      <button className="btn btn-primary" onClick={handleConfirmPayment} disabled={loading}>
        {loading ? "결제 준비 중..." : "결제 완료"}
      </button>
    </div>
  );
};

export default Payment;
