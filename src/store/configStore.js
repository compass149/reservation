import { combineReducers, createStore } from 'redux';  // createStore → createStore
import userReducer from './reduces/user';
import { persistReducer, persistStore } from 'redux-persist';  // persistStore → persistStore
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    storage,
};

const allReducers = combineReducers({
    user: userReducer,
});

const persistedReducer = persistReducer(persistConfig, allReducers);
const store = createStore(persistedReducer);  // store → store
export const persistor = persistStore(store);  // persistor는 persistStore로 수정
export default store;  // store를 export
