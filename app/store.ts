import { combineReducers, configureStore } from "@reduxjs/toolkit";
import classesSlice from "./lib/redux/classesSlice";
import lessonsSlice from "./lib/redux/lessonsSlice";

const rootReducer = combineReducers({
    classes: classesSlice.reducer,
    lessons: lessonsSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
});

export default store;
