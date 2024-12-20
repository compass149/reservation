import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Payment.css";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { room, checkIn, checkOut, totalUser, user } = location.state || {};

  const [payName, setPayName] = useState("");
  const [payTel, setPayTel] = useState("");
  const [payEmail, setPayEmail] = useState("");

  // 포인트나 쿠폰 사용 등의 값도 필요하다면 state로 관리 가능
  const [usePoint, setUsePoint] = useState(0);
  const [useUserCouponNo, setUseUserCouponNo] = useState(null);

  // 가격 계산 로직 (실제 로직에 맞게 수정)
  const totalPrice = totalUser && room ? totalUser * room.price : 0;
  const discountPrice = 0; // 예: 할인 로직 반영 가능
  const totalPayPrice = totalPrice - discountPrice;

  const handleKakaoPay = async () => {
    // 토큰 확인
    const token = localStorage.getItem("jwtToken");
    if (!token) {
      alert("로그인이 필요합니다. 다시 로그인해주세요.");
      window.location.href = "/login";
      return;
    }

    // 입력 값 검증
    if (!payName) {
      alert("이름을 입력해주세요.");
      return;
    }
    if (!payTel) {
      alert("전화번호를 입력해주세요.");
      return;
    }
    if (!payEmail) {
      alert("이메일을 입력해주세요.");
      return;
    }

    try {
      // 서버에 결제 준비 요청
      // (원문에서 jQuery로 보낸 /order/pay GET 요청을 axios GET 요청으로 변경)
      const response = await axios.get("http://localhost:8082/order/pay", {
        params: {
          total_amount: totalPayPrice,
          payUserName: payName,
          sumPrice: totalPrice,
          discountPrice: discountPrice,
          totalPrice: totalPayPrice,
          tel: payTel,
          email: payEmail,
          usePoint: usePoint,
          useCouponNo: useUserCouponNo
        },
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { next_redirect_pc_url } = response.data;
      // 카카오 결제 페이지로 이동
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
        weekday = part.value;
      } else {
        formattedDate += part.value;
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
        <h1 className="payment-title">결제 페....이지</h1>
        <p><strong>선택한 방</strong>: {room.roomName}</p>
        <p><strong>체크인</strong>: {formatDate(checkIn)}</p>
        <p><strong>체크아웃</strong>: {formatDate(checkOut)}</p>
        <p><strong>예약 인원</strong>: {totalUser}명</p>
        <p><strong>가격</strong>: {totalPrice}원</p>

        {/* 결제자 정보 입력 폼 */}
        <div>
          <label>
            이름:
            <input 
              type="text"
              value={payName}
              onChange={(e) => setPayName(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            전화번호:
            <input 
              type="text"
              value={payTel}
              onChange={(e) => setPayTel(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            이메일:
            <input 
              type="email"
              value={payEmail}
              onChange={(e) => setPayEmail(e.target.value)}
            />
          </label>
        </div>

        {/* 쿠폰/포인트 사용 예시
        <div>
          <label>
            사용 포인트:
            <input
              type="number"
              value={usePoint}
              onChange={(e) => setUsePoint(e.target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            쿠폰 번호:
            <input
              type="text"
              value={useUserCouponNo}
              onChange={(e) => setUseUserCouponNo(e.target.value)}
            />
          </label>
        </div>
        */}

        <button className="btn btn-primary" onClick={handleKakaoPay}>
          카카오페이 결제하기
        </button>
      </div>
    </div>
  );
};

export default Payment;
