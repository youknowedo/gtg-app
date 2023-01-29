import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Skola24Object } from "skola24";

export type ClassesState = {
    classes?: Skola24Object[];
    selectedIndex: number;
    loading: boolean;
    error: boolean;
};

const initialState: ClassesState = {
    classes: [],
    selectedIndex: 0,
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
            state.selectedIndex = selectedClassIndex.payload;
        },
    },
});

export const { setClasses, setSelectedClass } = classesSlice.actions;

export default classesSlice;
