import {combineReducers, legacy_createStore as createStore} from 'redux'
import userReducer from './reduces/user'
import {persistStore, persistReducer} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig={
    key:'root',
    storage,
}

const allReducers=combineReducers({
    user:userReducer
})

const persistedReducer=persistReducer(persistConfig, allReducers);
const store=createStore(persistedReducer);
export const persistor=persistStore(store);
export default store;