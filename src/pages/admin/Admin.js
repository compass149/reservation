import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // Link 추가
import roomService from "../../services/room.service";
import RoomSave from "../../components/RoomSave";
import RoomDelete from "../../components/RoomDelete";
import { format } from 'date-fns';
import "./Admin.css";

const Admin = () => {
    const [roomList, setRoomList] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null); 
    const saveComponent = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const deleteComponent = useRef();

    // 방 목록 가져오기
    useEffect(() => {
        console.log("방 목록을 가져옵니다...");
        roomService.getAllRooms().then((response) => {
            console.log("가져온 방 데이터:", response.data);
            setRoomList(response.data);
        }).catch((error) => {
            console.error("방 목록을 가져오는 중 오류 발생:", error);
        });
    }, []);

    const createRoomRequest = () => {
        console.log("새 방 추가 요청");
        setSelectedRoom(null);
        saveComponent.current?.showRoomModal();
    };

    const saveRoomWatcher = (room) => {
        console.log("저장된 방 정보:", room);
        let itemIndex = roomList.findIndex((item) => item.id === room.id);
        if (itemIndex !== -1) {  // 수정일 때
            console.log("방 수정 처리");
            const newList = roomList.map((item) => {
                if (item.id === room.id) {
                    return room;
                }
                return item;
            });
            setRoomList(newList);
        } else { // 저장일 때
            console.log("새로운 방 추가");
            const newList = roomList.concat(room);
            setRoomList(newList);
        }
    };

    const editRoomRequest = (item) => {
        console.log("방 수정 요청:", item);
        setSelectedRoom(item);
        saveComponent.current?.showRoomModal();
    };

    const deleteRoom = () => {
        if (!selectedRoom) {
            console.warn("선택된 방이 없습니다. 삭제를 중단합니다.");
            return; 
        }
        console.log("방 삭제 요청:", selectedRoom);
        roomService
            .deleteRoom(selectedRoom)
            .then((_) => {
                console.log("방 삭제 성공:", selectedRoom);
                setRoomList(roomList.filter((p) => p.id !== selectedRoom.id));
            })
            .catch((err) => {
                console.error("방 삭제 중 오류 발생:", err);
                setErrorMessage('삭제 중 에러 발생!');
            });
    };

    const deleteRoomRequest = (item) => {
        console.log("방 삭제 확인 요청:", item);
        setSelectedRoom(item);
        deleteComponent.current?.showDeleteModel();
    };
    const isValidDate = (date) => {
        const parsedDate = new Date(date);
        return !isNaN(parsedDate.getTime());
    };
// 배열을 Date 객체로 변환하는 함수
const convertToDate = (dateArray) => {
    if (!Array.isArray(dateArray) || dateArray.length < 6) {
        console.error("Invalid date array:", dateArray);
        return null; // 유효하지 않은 데이터 처리
    }
    const [year, month, day, hour, minute, second] = dateArray;
    return new Date(year, month - 1, day, hour, minute, second); // month는 0부터 시작
};

    return (
        <div className="container">
            <div className="card mt-5">
                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                <div className="card-header">
                    <div className="col-6"><h3>등록된 방</h3></div>
                    <div className="col-6 text-end">
                        <button className="btn btn-primary" onClick={createRoomRequest}>추가</button>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col"></th>
                                <th scope="col">방이름</th>
                                <th scope="col">가격</th>
                                <th scope="col">인원</th>
                                <th scope="col">등록일</th>
                                <th scope="col"></th>
                            </tr>
                        </thead>
                        <tbody>
                        {roomList.map((item, ind) => {
                            console.log("item.createdAt (raw):", item.createdAt);
                            const parsedDate = convertToDate(item.createdAt); // 날짜 변환
                            return (
                                <tr key={item.id}>
                                <th scope="row">{ind + 1}</th>
                                <td>
                                    <Link to={`/roominfo/${item.id}`} style={{ textDecoration: 'none', color: '#333333' }}>
                                    {item.name}
                                 </Link>
                                </td>
                                <td>{`${item.price}원`}</td>
                                <td>{item.capacity}</td>
                                <td>
                                    {parsedDate
                                    ? format(parsedDate, 'yyyy-MM-dd HH:mm:ss')
                                    : 'N/A'}
                                </td>
                                <td>
                                    <button className="btn btn-primary me-1" onClick={() => editRoomRequest(item)}>수정</button>
                                    <button className="btn btn-danger" onClick={() => deleteRoomRequest(item)}>삭제</button>
                                </td>
                                </tr>
                            );
                         })}
                         </tbody>
                    </table>
                </div>
            </div>
            <RoomSave ref={saveComponent} room={selectedRoom || {}} onSaved={(p) => saveRoomWatcher(p)} />
            <RoomDelete ref={deleteComponent} onConfirmed={() => deleteRoom()} />
        </div>
    );
}

export default Admin;