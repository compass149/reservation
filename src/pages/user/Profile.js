import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import roomService from '../../services/room.service';
import './Profile.css';

const Profile = () => {
    const [reservation, setReservation] = useState([]);
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
                const user = JSON.parse(localStorage.getItem("currentUser"));
                fetchReservations(user);
            })
            .catch(error => {
                console.error("Error cancelling reservation:", error);
                alert("예약 취소 중 오류가 발생했습니다.");
            });
    };

    const formatDateWithDay = (dateString) => {
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return 'Invalid Date';
        const formattedDate = date.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
        const weekday = date.toLocaleDateString('ko-KR', { weekday: 'short' });
        return `${formattedDate} (${weekday})`;
    };

    return (
        <div className="container card mt-5">
            <div className="card-header">
                <div className="col-6"><h3>내 예약 목록</h3></div>
            </div>
            {error && <p className="alert alert-danger error-message">{error}</p>}

            {reservation.length > 0 ? (
                <table className="card-body table table-striped">
                    <thead>
                        <tr>
                            <th scope="col">순번</th>
                            <th scope="col">방 이름</th>
                            <th scope="col">체크인</th>
                            <th scope="col">체크아웃</th>
                            <th scope="col">예약 상태</th>
                            <th scope="col">취소</th>
                        </tr>
                    </thead>
                    <tbody>
                        {reservation.map((r) => (
                            <tr key={r.rsvId}>
                                <td>{r.rsvId}</td>
                                <td>{r.roomName}</td>
                                <td>{formatDateWithDay(r.checkIn)}</td>
                                <td>{formatDateWithDay(r.checkOut)}</td>
                                <td>{r.status}</td>
                                <td>
                                    {r.status !== '취소' && (
                                        <button className="btn btn-primary me-1" onClick={() => handleCancel(r.rsvId)}>취소</button>
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
