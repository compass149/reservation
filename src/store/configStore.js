import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer  from "./reduces/user"
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // localStorage 사용

// redux-persist 설정
const persistConfig = {
    key: "root",
    storage, // localStorage
};

// 리듀서 합치기
const rootReducer = combineReducers({
    user: userReducer,
});

// Persisted 리듀서 생성
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Redux 스토어 설정
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // redux-persist 사용 시 직렬화 에러 방지
        }),
    devTools: process.env.NODE_ENV !== "production", // 개발 도구 활성화
});

// persistor 생성
export const persistor = persistStore(store);

export default store;
