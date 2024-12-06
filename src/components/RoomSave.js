import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Modal } from 'react-bootstrap';
import roomService from "../services/room.service";
import Rooms from './../models/Rooms';  // 클래스 이름을 대문자로 시작하도록 수정

const RoomSave = forwardRef((props, ref) => {
    const [room, setRoom] = useState(new Rooms('', '', 0));
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    // useImperativeHandle을 사용하여 ref에서 호출 가능한 메서드 정의
    useImperativeHandle(ref, () => ({
        showRoomModal() {
            setShow(true);  // Modal을 열기 위한 함수
        }
    }));

    useEffect(() => {
        if (props.room) {
            setRoom(props.room);
            console.log(props.room);
        }
    }, [props.room]);

    const saveRoom = (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!room.name || !room.description || !room.price) {
            return;
        }

        roomService.saveRoom(room)
            .then((response) => {
                props.onSaved(response.data);  // 상위 컴포넌트에 저장 데이터 전달
                setShow(false);
                setSubmitted(false);
            })
            .catch((err) => {
                setErrorMessage('제품 저장 시 오류 발생!');
                console.log(err);
            });
        setRoom(new Rooms('', '', 0)); // 입력창 초기화
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        setRoom((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };

    return (
        <Modal show={show}>
            <form noValidate onSubmit={saveRoom} className={submitted ? 'was-validated' : ''}>
                <div className='modal-header'>
                    <h5 className='modal-title'>방정보</h5>
                    <button type='button' className='btn-close' onClick={() => setShow(false)}></button>
                </div>
                <div className='modal-body'>
                    {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

                    <div className='form-group'>
                        <label htmlFor='name'>방 이름: </label>
                        <input
                            type='text'
                            name='name'
                            placeholder='방 이름'
                            className='form-control'
                            value={room?.name}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>방 이름을 적어주십시오.</div>
                    </div>

                    <div className='form-group'>
                        <label htmlFor='description'>방 설명: </label>
                        <textarea
                            name='description'
                            placeholder='설명'
                            className='form-control'
                            value={room?.description}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>설명을 적어주십시오.</div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='price'>가격: </label>
                        <input
                            type='number'
                            min='1'
                            step='any'
                            name='price'
                            placeholder='가격'
                            className='form-control'
                            value={room?.price}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>가격은 0보다 커야 합니다.</div>
                    </div>
                </div>
                <div className='modal-footer'>
                    <button type='button' className='btn btn-secondary' onClick={() => setShow(false)}>
                        닫기
                    </button>
                    <button type='submit' className='btn btn-primary'>
                        저장하기
                    </button>
                </div>
            </form>
        </Modal>
    );
});

export default RoomSave;
