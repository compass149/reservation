import React from "react";

const ApprovalResult = ({ response }) => {
  const closePopup = () => {
    if (window.opener) {
      window.opener.location.href = "/";
    }
    window.close();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>승인 결과 (Result of Approval)</h1>
      <p>{response}</p>
      <button
        onClick={closePopup}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          backgroundColor: "#4CAF50",
          color: "white",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer",
        }}
      >
        Close
      </button>
    </div>
  );
};

export default ApprovalResult;
