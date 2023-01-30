import { combineReducers, configureStore } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { persistReducer } from "redux-persist";
import persistStore from "redux-persist/lib/persistStore";
import classesSlice from "./lib/redux/classesSlice";
import eventsSlice from "./lib/redux/eventsSlice";
import foodsSlice from "./lib/redux/foodsSlice";
import lessonsSlice from "./lib/redux/lessonsSlice";
import schoolYearSlice from "./lib/redux/schoolYearSlice";

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
};

const rootReducer = persistReducer(
    persistConfig,
    combineReducers({
        classes: classesSlice.reducer,
        lessons: lessonsSlice.reducer,
        events: eventsSlice.reducer,
        foods: foodsSlice.reducer,
        schoolYear: schoolYearSlice.reducer,
    })
);

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
});

export default store;

export const persistor = persistStore(store);
