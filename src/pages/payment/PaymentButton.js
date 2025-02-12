import React, { useState } from "react";
import axios from "axios";

const PaymentButton = ({ reservationData, rsvId }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // 결제 준비 API 호출
      const response = await axios.post(
        `http://localhost:8082/api/payment/ready/${reservationData.agent}/${reservationData.openType}`,
        {
          rsvId: reservationData.rsvId,  // 실제 키/필드명에 맞추기
          itemName: reservationData.itemName,
          totalAmount: reservationData.totalAmount,
          userId: reservationData.userId,
        }
      );
      console.log("예약아이디----------------", rsvId )

      // 카카오페이 결제 창 열기
      const popup = window.open(
        "",
        "paypopup",
        "width=426,height=510,toolbar=no,scrollbars=no,resizable=no"
      );

      if (popup) {
        // 서버 응답에서 next_redirect_pc_url 로 이동
        popup.location.href = response.data.next_redirect_pc_url;
      } else {
        throw new Error("팝업을 열 수 없습니다. (Popup Blocked)");
      }
    } catch (error) {
      console.error("결제 준비 중 오류 발생:", error);
      setErrorMessage(
        error?.response?.data ??
          "결제 준비 요청 중 문제가 발생했습니다. 다시 시도해주세요."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button
        onClick={handlePayment}
        className="btn btn-primary"
        disabled={loading}
      >
        {loading ? "결제 준비 중..." : "결제하기"}
      </button>

      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
      )}
    </div>
  );
};

export default PaymentButton;
