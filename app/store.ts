import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AsyncStorage } from "react-native";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/lib/persistStore";
import classesSlice from "./lib/redux/classesSlice";
import lessonsSlice from "./lib/redux/lessonsSlice";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
};

const classesReducer = persistReducer(persistConfig, classesSlice.reducer);

const rootReducer = combineReducers({
    classes: classesReducer,
    lessons: lessonsSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
});

export default store;

export const persistor = persistStore(store);
