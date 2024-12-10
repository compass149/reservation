import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom"; // Link 추가
import roomService from "../../services/room.service";
import RoomSave from "../../components/RoomSave";
import RoomDelete from "../../components/RoomDelete";
import "./Admin.css"

const Admin = () => {
    const [roomList, setRoomList] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null); 
    const saveComponent = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const deleteComponent = useRef();

    useEffect(() => {
        roomService.getAllRooms().then((response) => {
            console.log("Fetched rooms:", response.data);
            setRoomList(response.data);
        });
    }, []);

    const createRoomRequest = () => {
        setSelectedRoom(null);
        saveComponent.current?.showRoomModal();
    };

    const saveRoomWatcher = (room) => {
        let itemIndex = roomList.findIndex((item) => item.id === room.id);
        if (itemIndex !== -1) {  // 수정일 때
            const newList = roomList.map((item) => {
                if (item.id === room.id) {
                    return room;
                }
                return item;
            });
            setRoomList(newList);
        } else { // 저장일 때
            const newList = roomList.concat(room);
            setRoomList(newList);
        }
    };

    const editRoomRequest = (item) => {
        console.log(item);
        setSelectedRoom(item);
        saveComponent.current?.showRoomModal();
    };

    const deleteRoom = () => {
        if (!selectedRoom) return; 
        roomService
            .deleteRoom(selectedRoom)
            .then((_) => {
                setRoomList(roomList.filter((p) => p.id !== selectedRoom.id));
            })
            .catch((err) => {
                setErrorMessage('삭제 중 에러 발생!');
                console.log(err);
            });
    };

    const deleteRoomRequest = (item) => {
        console.log(item);
        setSelectedRoom(item);
        deleteComponent.current?.showDeleteModel();
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
                            {roomList.map((item, ind) => (
                                <tr key={item.id}>
                                    <th scope="row">{ind + 1}</th>
                                    <td>
                                        <Link to={`/roominfo/${item.id}`} style={{ textDecoration: 'none', color: 'blue' }}>
                                            {item.name}
                                        </Link>
                                    </td>
                                    <td>{`${item.price}원`}</td>
                                    <td>{item.capacity}</td>
                                    <td>{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <button className="btn btn-primary me-1" onClick={() => editRoomRequest(item)}>수정</button>
                                        <button className="btn btn-danger" onClick={() => deleteRoomRequest(item)}>삭제</button>
                                    </td>
                                </tr>
                            ))}
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