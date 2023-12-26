import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import homeReducer from "./homeSlice";
import deviceReducer from "./deviceSlice";
import categoryReducer from "./categorySlice";
import departmentReducer from "./departmentSlice";
import statusReducer from "./statusSlice";
import locationReducer from "./locationSlice";
import repairerReducer from "./repairerSlice";
import mnHisReducer from "./mnHisSlice";
import rpHisReducer from "./repairHisSlice";
import unitReducer from "./unitSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const persistConfig = {
    key: 'root',
    version: 1,
    storage,
}
const rootReducer = combineReducers({
    auth: authReducer,
    home:homeReducer,
    devices:deviceReducer,
    categories:categoryReducer,
    statuses:statusReducer,
    locations:locationReducer,
    repairers: repairerReducer,
    maintenance: mnHisReducer,
    repairhistories: rpHisReducer,
    departments: departmentReducer,
    units: unitReducer
});
const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
        }),
})

export let persistor = persistStore(store)
