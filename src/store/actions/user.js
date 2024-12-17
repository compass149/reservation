import { CLEAR_CURRENT_USER, SET_CURRENT_USER } from "../types";

export const setCurrentUser = (user) => {
    return (dispatch) => {
        localStorage.setItem("currentUser", JSON.stringify(user));
        dispatch({
            type: SET_CURRENT_USER,
            payload: user,
        });
    };
};

// 사용자 제거 액션
export const clearCurrentUser = () => {
    return (dispatch) => {
        localStorage.removeItem("currentUser");
        dispatch({ type: CLEAR_CURRENT_USER });
    };
};