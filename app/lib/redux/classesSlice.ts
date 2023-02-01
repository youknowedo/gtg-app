import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Skola24Object } from "skola24";

export type ClassesState = {
    classes?: Skola24Object[];
    selectedClassIndex: number;
    loading: boolean;
    error: boolean;
};

const initialState: ClassesState = {
    classes: [],
    selectedClassIndex: 14,
    loading: false,
    error: false,
};

const classesSlice = createSlice({
    name: "classes",
    initialState,
    reducers: {
        setClasses: (state, newState: PayloadAction<Skola24Object[]>) => {
            state.classes = newState.payload;
        },
        setSelectedClass: (
            state,
            selectedClassIndex: PayloadAction<number>
        ) => {
            state.selectedClassIndex = selectedClassIndex.payload;
        },
        setLoadingClasses: (state, classesLessons: PayloadAction<boolean>) => {
            state.loading = classesLessons.payload;
        },
        setClassesLoadingError: (
            state,
            classesLoadingError: PayloadAction<boolean>
        ) => {
            state.error = classesLoadingError.payload;
        },
    },
});

export const {
    setClasses,
    setSelectedClass,
    setLoadingClasses,
    setClassesLoadingError,
} = classesSlice.actions;

export default classesSlice;
