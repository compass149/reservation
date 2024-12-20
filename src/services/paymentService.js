// services/paymentService.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8082'; // 백엔드 주소

export const readyPayment = async (orderId, userId, itemName, quantity, totalAmount) => {
  const response = await axios.get(`${API_BASE_URL}/kakaoPayReady`, {
    params: { orderId, userId, itemName, quantity, totalAmount }
  });
  return response.data; // response: { next_redirect_pc_url, tid, ... }
};

export const approvePayment = async (pgToken) => {
  const response = await axios.get(`${API_BASE_URL}/kakaoPaySuccess`, {
    params: { pg_token: pgToken }
  });
  return response.data; // 결제 승인 결과
};
