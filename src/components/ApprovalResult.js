import React, { useEffect, useState } from "react";
import axios from "axios";

const ApprovalResult = () => {
  const [approvalResult, setApprovalResult] = useState(null);
  const [error, setError] = useState(null);

  // URL에서 매개변수 추출
  const query = new URLSearchParams(window.location.search);
  const pgToken = query.get("pg_token");
  const agent = query.get("agent");
  const openType = query.get("openType");

  useEffect(() => {
    const fetchApprovalResult = async () => {
      if (!pgToken || !agent || !openType) {
        setError("필수 매개변수가 누락되었습니다.");
        return;
      }

      try {
        // 결제 승인 요청
        // const response = await axios.get(
        const url = `http://localhost:8082/api/payment/approve/${agent}/${openType}?pg_token=${pgToken}`;
        axios.get(url)
              .then(response => {
                console.log(response.data);
              })          
        // if (response.status === 200) {
        //   // 결제 승인 성공
        //   setApprovalResult(response.data);
        // }
      } catch (err) {
        // 오류 처리
        setError(err.response?.data || "결제 승인 중 오류가 발생했습니다.");
      }
    };

    fetchApprovalResult();
  }, [pgToken, agent, openType]); // rsvId를 의존성 배열에 추가

  // 팝업 닫기
  const closePopup = () => {
    if (window.opener) {
      window.opener.location.reload(); // 부모 창 새로고침
    }
    window.close(); // 팝업 창 닫기
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      {error ? (
        <>
          <h1 style={{ color: "red" }}>결제 승인 실패</h1>
          <p>{error}</p>
        </>
      ) : approvalResult ? (
        <>
          <h1 style={{ color: "green" }}>결제 승인 성공</h1>
          <p>승인 결과: {approvalResult}</p>
        </>
      ) : (
        <p>결제 승인 처리 중...</p>
      )}
      <button
        onClick={closePopup}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          backgroundColor: "#007BFF",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        닫기
      </button>
    </div>
  );
};

export default ApprovalResult;
