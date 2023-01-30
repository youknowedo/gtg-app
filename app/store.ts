import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { AsyncStorage } from "react-native";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/lib/persistStore";
import classesSlice from "./lib/redux/classesSlice";
import eventsSlice from "./lib/redux/eventsSlice";
import foodsSlice from "./lib/redux/foodsSlice";
import lessonsSlice from "./lib/redux/lessonsSlice";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
};

const classesReducer = persistReducer(persistConfig, classesSlice.reducer);
const lessonsReducer = persistReducer(persistConfig, lessonsSlice.reducer);
const eventsReducer = persistReducer(persistConfig, eventsSlice.reducer);
const foodsReducer = persistReducer(persistConfig, foodsSlice.reducer);

const rootReducer = combineReducers({
    classes: classesReducer,
    lessons: lessonsReducer,
    events: eventsReducer,
    foods: foodsReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
});

export default store;

export const persistor = persistStore(store);
