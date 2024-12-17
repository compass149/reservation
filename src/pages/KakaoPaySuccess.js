import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const KakaoPaySuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);

  const handleApprovePayment = async () => {
    const paymentApprovalData = {
      orderId: localStorage.getItem("orderId"), // 저장된 주문 ID
      userId: localStorage.getItem("userId"), // 사용자 ID
      tid: localStorage.getItem("tid"), // 결제 준비 시 받은 TID
      pgToken: query.get("pg_token"), // 카카오페이에서 반환한 승인 토큰
    };

    try {
      const response = await axios.post("http://localhost:8082/api/payment/approve", paymentApprovalData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwtToken")}`,
        },
      });

      console.log("결제 승인 성공:", response.data);
      alert("결제가 완료되었습니다!");
      navigate("/profile");
    } catch (error) {
      console.error("결제 승인 중 오류 발생:", error);
      alert("결제 승인 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    handleApprovePayment();
  }, []);

  return <div>결제를 승인 중입니다...</div>;
};

export default KakaoPaySuccess;
