import { forwardRef, useImperativeHandle, useState } from "react";
import { Modal } from "react-bootstrap";

const RoomDelete=forwardRef((props, ref)=>{
    const [show, setShow]=useState(false);
    useImperativeHandle(ref, () =>({
        showDeleteModel(){
            setShow(true);
        }
    }));

    const deleteRoom=()=>{
        props.onConfirmed();
        setShow(false);
    }

    return(
        <Modal show={show}>
			<div className='modal-header'>
				<h5 className='modal-title'>Confirmation</h5>
				<button type='button' className='btn-close' onClick={() => setShow(false)}></button>
			</div>

			<div className='modal-body'>정말로 이 방을 삭제하겠습니까?</div>

			<div className='modal-footer'>
				<button type='button' className='btn btn-secondary' onClick={() => setShow(false)}>
					취소
				</button>
				<button type='button' className='btn btn-danger' onClick={deleteRoom}>
					삭제확인
				</button>
			</div>
		</Modal>
    );
});
export default RoomDelete;