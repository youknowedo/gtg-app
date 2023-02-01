import AsyncStorage from "@react-native-async-storage/async-storage";
import {
    CombinedState,
    combineReducers,
    configureStore,
    createReducer,
    Reducer,
    ReducersMapObject,
} from "@reduxjs/toolkit";
import {
    FLUSH,
    PAUSE,
    PERSIST,
    persistReducer,
    PURGE,
    REGISTER,
    REHYDRATE,
} from "redux-persist";
import persistStore from "redux-persist/lib/persistStore";
import { PersistConfig } from "redux-persist/lib/types";

import classesSlice from "./lib/redux/classesSlice";
import eventsSlice from "./lib/redux/eventsSlice";
import foodsSlice from "./lib/redux/foodsSlice";
import lessonsSlice from "./lib/redux/lessonsSlice";
import schoolYearSlice from "./lib/redux/schoolYearSlice";

const combinePersistReducers = <S>(
    config: PersistConfig<S[Extract<keyof S, string>]>,
    reducers: ReducersMapObject<S, any>
): Reducer<CombinedState<S>> => {
    for (const key in reducers) {
        if (Object.prototype.hasOwnProperty.call(reducers, key)) {
            const reducer = reducers[key];

            reducers[key] = persistReducer(config, reducer) as Reducer<
                S[Extract<keyof S, string>],
                any
            >;
        }
    }

    return combineReducers(reducers);
};

const persistConfig = {
    key: "root",
    storage: AsyncStorage,
};

const rootReducer = combinePersistReducers(persistConfig, {
    foods: foodsSlice.reducer,
    classes: classesSlice.reducer,
    lessons: lessonsSlice.reducer,
    events: eventsSlice.reducer,
    schoolYear: schoolYearSlice.reducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [
                    FLUSH,
                    REHYDRATE,
                    PAUSE,
                    PERSIST,
                    PURGE,
                    REGISTER,
                ],
            },
        }),
});

export default store;

export const persistor = persistStore(store);
