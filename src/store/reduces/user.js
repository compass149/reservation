import { CLEAR_CURRENT_USER, SET_CURRENT_USER } from "../types";

// 초기 상태를 정의
const initialState = JSON.parse(localStorage.getItem('currentUser')) || null;

const userReducer = (state = initialState, action) => {
    switch (action?.type) {
        case SET_CURRENT_USER:
            return action?.payload; // 상태만 반환
        case CLEAR_CURRENT_USER:
            return null; // 상태를 null로 설정
        default:
            return state;
    }
};

export default userReducer;