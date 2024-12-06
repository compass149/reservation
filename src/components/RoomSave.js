import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Modal } from 'react-bootstrap';
import roomService from "../services/room.service";

const RoomSave = forwardRef((props, ref) => {
    const [room, setRoom] = useState({ name: '', description: '', price: 50000, capacity: 4 });
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    useImperativeHandle(ref, () => ({
        showRoomModal() {
            setShow(true);
        },
    }));

    useEffect(() => {
        if (props.room) {
            setRoom({
                name: props.room.name || '',
                description: props.room.description || '',
                price: props.room.price || 0,
                capacity: props.room.capacity || 0,
            });
        }
    }, [props.room]);

    const saveRoom = (e) => {
        e.preventDefault();
        setSubmitted(true);

        if (!room.name || !room.description || room.price <= 0 || room.capacity <= 0) {
            return;
        }

        roomService.saveRoom(room)
            .then((response) => {
                props.onSaved(response.data);
                setShow(false);
                setSubmitted(false);
            })
            .catch((err) => {
                setErrorMessage('방 정보를 저장하는 중 오류가 발생했습니다.');
                console.error(err);
            });

        setRoom({ name: '', description: '', price: 0, capacity: 0 });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoom((prevState) => ({
            ...prevState,
            [name]: name === 'price' || name === 'capacity' ? Number(value) : value,
        }));
    };

    return (
        <Modal show={show}>
            <form noValidate onSubmit={saveRoom} className={submitted ? 'was-validated' : ''}>
                <div className='modal-header'>
                    <h5 className='modal-title'>방 정보</h5>
                    <button type='button' className='btn-close' onClick={() => setShow(false)}></button>
                </div>
                <div className='modal-body'>
                    {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

                    <div className='form-group'>
                        <label htmlFor='name'>방 이름:</label>
                        <input
                            type='text'
                            name='name'
                            placeholder='방 이름'
                            className='form-control'
                            value={room.name}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>방 이름을 입력하세요.</div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='capacity'>최대 수용 인원:</label>
                        <input
                            type='number'
                            name='capacity'
                            placeholder='인원'
                            className='form-control'
                            value={room.capacity}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>최대 수용 인원을 입력하세요.</div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='description'>방 설명:</label>
                        <textarea
                            name='description'
                            placeholder='설명'
                            className='form-control'
                            value={room.description}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>방 설명을 입력하세요.</div>
                    </div>
                    <div className='form-group'>
                        <label htmlFor='price'>가격:</label>
                        <input
                            type='number'
                            min='1'
                            step='any'
                            name='price'
                            placeholder='가격'
                            className='form-control'
                            value={room.price}
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
