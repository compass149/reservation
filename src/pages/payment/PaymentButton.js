import React, { useState } from "react";
import axios from "axios";

const PaymentButton = ({ reservationData }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // 결제 준비 API 호출
      const response = await axios.post(
        `http://localhost:8082/api/payment/ready/${reservationData.agent}/${reservationData.openType}`
      );

      // 응답 데이터 확인
      if (!response.data.next_redirect_pc_url) {
        throw new Error("결제 준비 URL을 받을 수 없습니다.");
      }

      // 카카오페이 결제 창 열기
      const popup = window.open(
        `http://localhost:8082/approve/pc/popup?pg_token=${pgToken}`,
        "KakaoPayPopup",
        "width=500,height=600,scrollbars=no,resizable=no"
        // "",
        // "paypopup",
        // "width=426,height=510,toolbar=no,scrollbars=no,resizable=no"
      );

      if (popup) {
        // 팝업에 URL 설정
        popup.location.href = response.data.next_redirect_pc_url;
      } else {
        throw new Error("팝업이 차단되었습니다. 브라우저 설정을 확인해주세요.");
      }
    } catch (error) {
      console.error("결제 준비 중 오류 발생:", error);
      setErrorMessage(
        error?.response?.data?.message ??
          error?.message ??
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
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {loading ? (
          <>
            <span>결제 준비 중...</span>
            <span
              style={{
                width: "1rem",
                height: "1rem",
                border: "2px solid #fff",
                borderTop: "2px solid #000",
                borderRadius: "50%",
                animation: "spin 1s linear infinite",
              }}
            ></span>
          </>
        ) : (
          "결제하기"
        )}
      </button>

      {errorMessage && (
        <div style={{ color: "red", marginTop: "10px" }}>{errorMessage}</div>
      )}

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
};

export default PaymentButton;
