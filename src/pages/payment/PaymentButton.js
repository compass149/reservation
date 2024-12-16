import React from "react";
import axios from "axios";

const PaymentButton = ({ reservationData }) => {
  const handlePayment = async () => {
    try {
      const response = await axios.post("http://localhost:8082/api/payment/ready", reservationData);
      const { next_redirect_pc_url } = response.data;

      // 카카오페이 결제 페이지로 이동
      window.location.href = next_redirect_pc_url;
    } catch (error) {
      console.error("결제 준비 중 오류 발생:", error);
      alert("결제 준비 중 오류가 발생했습니다. 다시 시도해주세요.");
    }
  };

  return (
    <button onClick={handlePayment} className="btn btn-primary">
      결제하기
    </button>
  );
};

export default PaymentButton;
