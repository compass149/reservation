import React from "react";
import ReactDOM from "react-dom";
import ApprovalResult from "./components/ApprovalResult";

// 서버로부터 전달받은 응답 (예시)
const response = "결제가 성공적으로 승인되었습니다.";

ReactDOM.render(
  <ApprovalResult response={response} />,
  document.getElementById("root")
);
