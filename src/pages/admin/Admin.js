import React, { useEffect, useRef, useState } from "react";
import roomService from "../../services/room.service";
import RoomSave from "../../components/RoomSave";
import RoomDelete from "../../components/RoomDelete";

const Admin = () => {
    const [roomList, setRoomList] = useState([]);
    const [selectedRoom, setSelectedRoom] = useState(null); // 초기값을 null로 설정
    const saveComponent = useRef();
    const [errorMessage, setErrorMessage] = useState('');
    const deleteComponent = useRef();

    useEffect(() => {
        roomService.getAllRooms().then((response) => {
            setRoomList(response.data);
        });
    }, []);

    const createRoomRequest = () => {
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
        if (!selectedRoom) return; // selectedRoom이 null일 경우 방어 코드 추가
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
                    <div className="col-6"><h3>모든 제품들</h3></div>
                    <div className="col-6 text-end">
                        <button className="btn btn-primary" onClick={createRoomRequest}>새 제품</button>
                    </div>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th scope="col">#</th>
                                <th scope="col">Name</th>
                                <th scope="col">Price</th>
                                <th scope="col">Date</th>
                                <th scope="col">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {roomList.map((item, ind) => (
                                <tr key={item.id}>
                                    <th scope="row">{ind + 1}</th>
                                    <td>{item.name}</td>
                                    <td>{`${item.price}원`}</td>
                                    <td>{new Date(item.createTime).toLocaleDateString()}</td>
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