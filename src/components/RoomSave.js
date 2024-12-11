import { forwardRef, useEffect, useImperativeHandle, useState } from "react";
import { Modal } from 'react-bootstrap';
import roomService from "../services/room.service";
import Rooms from "../models/Rooms";

const MAX_FILE_SIZE = 30 * 1024 * 1024; // 30MB

const RoomSave = forwardRef((props, ref) => {
    const [room, setRoom] = useState(new Rooms(0, '', 0, '', '', 0));
    const [errorMessage, setErrorMessage] = useState('');
    const [show, setShow] = useState(false);
    const [submitted, setSubmitted] = useState(false);
    const [files, setFiles] = useState([]); // 다중 파일 업로드를 위한 상태
    const [previewUrls, setPreviewUrls] = useState([]); // 다중 이미지 미리보기 URL

    useImperativeHandle(ref, () => ({
        showRoomModal() {
            setShow(true);
        },
    }));

    useEffect(() => {
        const initialRoom = props.room || new Rooms(0, '', 0, '', '', 0);
        setRoom(initialRoom);
        setFiles([]);
        setPreviewUrls(initialRoom.imageUrls ? initialRoom.imageUrls.map(url => `${process.env.REACT_APP_BASE_URL}/uploads/${url}`) : []);
        console.log(props.room);
    }, [props.room]);

    const resetForm = () => {
        setRoom(new Rooms(0, '', 0, '', '', 0));
        setFiles([]);
        setPreviewUrls([]);
        setSubmitted(false);
        setErrorMessage('');
    };

    const closeModal = () => {
        resetForm();
        setShow(false);
    };

    const saveRoom = (e) => {
        e.preventDefault();
        setSubmitted(true);

        // 필수 입력값 확인
        if (!room.name || !room.description || room.price <= 0 || room.capacity <= 0) {
            return;
        }

        // 이미지 파일 타입 확인
        const invalidFiles = files.filter(file => !file.type.startsWith("image/"));
        if (invalidFiles.length > 0) {
            setErrorMessage("이미지만 업로드해주십시오.");
            return;
        }

        const formData = new FormData();
        if (room.id && room.id > 0) {
            formData.append('id', room.id);
        }

        formData.append('name', room.name);
        formData.append('description', room.description);
        formData.append('price', room.price);
        formData.append('capacity', room.capacity);

        // 다중 파일 추가
        files.forEach(file => {
            formData.append('images', file);
        });

        roomService.saveRoom(formData)
            .then((response) => {
                props.onSaved(response.data);
                resetForm();
                setShow(false);
            })
            .catch((err) => {
                let errMsg = '방 정보를 저장하는 중 오류가 발생했습니다.';
                if (err.response && err.response.data && err.response.data.message) {
                    errMsg = err.response.data.message;
                } else if (err.message) {
                    errMsg = err.message;
                }
                setErrorMessage(errMsg);
                console.error(err);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setRoom((prevState) => ({
            ...prevState,
            [name]: (name === 'price' || name === 'capacity') ? Number(value) : value,
        }));
    };

    const handleFileChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        // 파일 크기 체크
        const oversized = selectedFiles.some(file => file.size > MAX_FILE_SIZE);
        if (oversized) {
            setErrorMessage('최대 30MB까지만 업로드 가능합니다.');
            setFiles([]);
            setPreviewUrls([]);
            return;
        }

        // 파일 타입 체크
        const nonImageFiles = selectedFiles.filter(file => !file.type.startsWith("image/"));
        if (nonImageFiles.length > 0) {
            setErrorMessage('이미지만 업로드해주십시오.');
            setFiles([]);
            setPreviewUrls([]);
            return;
        }

        setFiles(selectedFiles);
        const previews = selectedFiles.map(file => URL.createObjectURL(file));
        setPreviewUrls(previews);
    };

    return (
        <Modal show={show}>
            <form noValidate onSubmit={saveRoom} className={submitted ? 'was-validated' : ''}>
                <div className='modal-header'>
                    <h5 className='modal-title'>방 정보</h5>
                    <button type='button' className='btn-close' onClick={closeModal}></button>
                </div>
                <div className='modal-body'>
                    {errorMessage && <div className='alert alert-danger'>{errorMessage}</div>}

                    <div className='form-group mb-2'>
                        <label htmlFor='name'>방 이름:</label>
                        <input
                            type='text'
                            name='name'
                            placeholder='방 이름'
                            className='form-control'
                            value={room.name || ''}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>방 이름을 입력하세요.</div>
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='capacity'>최대 수용 인원:</label>
                        <input
                            type='number'
                            name='capacity'
                            placeholder='인원'
                            className='form-control'
                            value={room.capacity || 0}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>최대 수용 인원을 입력하세요.</div>
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='description'>방 설명:</label>
                        <textarea
                            name='description'
                            placeholder='설명'
                            className='form-control'
                            value={room.description || ''}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>방 설명을 입력하세요.</div>
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='price'>가격:</label>
                        <input
                            type='number'
                            min='1'
                            step='any'
                            name='price'
                            placeholder='가격'
                            className='form-control'
                            value={room.price || 0}
                            onChange={handleChange}
                            required
                        />
                        <div className='invalid-feedback'>가격은 0보다 커야 합니다.</div>
                    </div>
                    <div className='form-group mb-2'>
                        <label htmlFor='image'>방 이미지(최대 30MB)</label>
                        <input 
                            type='file' 
                            className='form-control'
                            onChange={handleFileChange}
                            accept="image/*"
                            multiple
                        />
                        {previewUrls.length > 0 && (
                            <div className="mt-2" style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                                {previewUrls.map((url, index) => (
                                    <img key={index} src={url} alt={room.name} style={{ width: '100px', height: 'auto' }} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className='modal-footer'>
                    <button type='button' className='btn btn-secondary' onClick={closeModal}>
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
