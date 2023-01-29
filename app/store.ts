import { combineReducers, configureStore } from "@reduxjs/toolkit";
import classesSlice from "./classesSlice";
import lessonsSlice from "./lessonsSlice";

const rootReducer = combineReducers({
	classes: classesSlice.reducer,
	lessons: lessonsSlice.reducer
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
	reducer: rootReducer
});

export default store;