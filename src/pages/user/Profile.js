import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import roomService from '../../services/room.service'; // 수정된 서비스
import './Profile.css'; // 스타일 파일

const Profile = () => {
    const [reservation, setReservation] = useState([]);  // 초기값을 빈 배열로 설정
    const [error, setError] = useState("");
    const navigate = useNavigate();
  
    const user = JSON.parse(localStorage.getItem("currentUser"));
    console.log(user);

    useEffect(() => {
        const currentUser = localStorage.getItem("currentUser");
        if (!currentUser) {
          console.error("No current user found in localStorage");
          navigate("/login");
        } else {
          const user = JSON.parse(currentUser);
          console.log("Parsed user object:", user);
      
          if (user && user.uid) {
            fetchReservations(user);
          } else {
            console.error("Invalid user object:", user);
            navigate("/login");
          }
        }
    }, [navigate]);

    const fetchReservations = (user) => {
        roomService.getReservationByUser(user)
            .then(response => {
                console.log("Fetched reservation:", response.data);
                console.table(response.data);
                setReservation(response.data);
            })
            .catch(error => {
                setError("예약 목록을 가져오는 데 오류가 발생했습니다.");
                console.error("Error fetching reservation:", error);
            });
    };

    const handleCancel = (rsvId) => {
        if (!window.confirm("정말 예약을 취소하시겠습니까?")) {
            return;
        }
        roomService.cancelReservation(rsvId)
            .then(response => {
                alert("예약이 취소되었습니다.");
                // 예약 목록 다시 불러오기
                const user = JSON.parse(localStorage.getItem("currentUser"));
                fetchReservations(user);
            })
            .catch(error => {
                console.error("Error cancelling reservation:", error);
                alert("예약 취소 중 오류가 발생했습니다.");
            });
    };
      
    return (
      <div className="profile-page">
        <h1>내 예약 목록</h1>
  
        {error && <p className="error-message">{error}</p>}
  
        {reservation.length > 0 ? (
          <table className="reservation-table">
            <thead>
              <tr>
                <th>순번</th>
                <th>방 이름</th>
                <th>체크인</th>
                <th>체크아웃</th>
                <th>예약 상태</th>
                <th>취소</th>
              </tr>
            </thead>
            <tbody>
              {reservation.map((r) => (
                <tr key={r.rsvId}>
                  <td>{r.rsvId}</td>
                  <td>{r.roomName}</td>
                  <td>{new Date(r.checkIn).toLocaleDateString()}</td>
                  <td>{new Date(r.checkOut).toLocaleDateString()}</td>
                  <td>{r.status}</td>
                  <td>
                    {r.status !== '취소' && (
                      <button onClick={() => handleCancel(r.rsvId)}>취소</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>예약 내역이 없습니다.</p>
        )}
      </div>
    );
};

export default Profile;
