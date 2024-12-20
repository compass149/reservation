// pages/user/KakaoPaySuccess.js
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { approvePayment } from '../../services/paymentService';

function KakaoPaySuccess() {
  const location = useLocation();
  const [paymentResult, setPaymentResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const pgToken = query.get('pg_token');

    const approve = async () => {
      try {
        const result = await approvePayment(pgToken);
        setPaymentResult(result);
      } catch (error) {
        console.error('결제 승인 오류:', error);
      } finally {
        setLoading(false);
      }
    };

    if (pgToken) {
      approve();
    } else {
      setLoading(false);
    }
  }, [location]);

  if (loading) {
    return <div>결제 승인 처리중...</div>;
  }

  if (!paymentResult) {
    return <div>결제 승인 결과를 불러올 수 없습니다.</div>;
  }

  return (
    <div>
      <h1>결제 성공!</h1>
      <p>결제 정보: {JSON.stringify(paymentResult)}</p>
      {/* 필요한 정보를 정제해서 보여주면 됨 */}
    </div>
  );
}

export default KakaoPaySuccess;
