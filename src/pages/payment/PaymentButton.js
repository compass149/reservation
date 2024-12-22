import React, { useState } from "react";
import axios from "axios";

const PaymentButton = ({ reservationData }) => {
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);

  // Validate the reservationData object first
  const { agent, openType } = reservationData;

  if (!agent || !openType) {
    return (
      <div style={{ color: "red" }}>
        잘못된 요청입니다. agent와 openType 값을 확인해주세요.
      </div>
    );
  }

  const handlePayment = async () => {
    setLoading(true);
    setErrorMessage(null);

    try {
      // Send POST request with agent and openType values
      const response = await axios.post(
        `http://localhost:8082/api/payment/ready/${agent}/${openType}`
      );

      // Check if the response contains redirection URLs for different agents
      if (response.data.redirectUrl) {
        // For mobile, redirect to the mobile payment page
        window.location.href = response.data.redirectUrl;
      } else if (response.data.webviewUrl) {
        // For app, use a webview to display the payment page
        window.location.href = response.data.webviewUrl;
      } else {
        // For PC, log the full response
        console.log(response.data);
      }

      setLoading(false);
    } catch (error) {
      setLoading(false);
      setErrorMessage("결제 준비 중 오류가 발생했습니다. 다시 시도해주세요.");
      console.error("결제 준비 중 오류 발생:", error);
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
        <div style={{ color: "red", marginTop: "10px" }}>
          {errorMessage}
        </div>
      )}
    </div>
  );
};

export default PaymentButton;
