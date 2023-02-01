import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ActionSheetIOS } from "react-native";
import { Lesson } from "skola24";
import { setClasses } from "./classesSlice";

export type LessonsState = {
    lessons?: Lesson[][];
    nextBlockIndex?: number;
    loading: boolean;
    error: boolean;
};

const initialState: LessonsState = {
    lessons: undefined,
    nextBlockIndex: undefined,
    loading: false,
    error: false,
};

const classesSlice = createSlice({
    name: "lessons",
    initialState,
    reducers: {
        setLessons: (
            state,
            newState: PayloadAction<Lesson[][] | undefined>
        ) => {
            state.lessons = newState.payload;

            if (state.lessons) {
                for (let i = 0; i < state.lessons.length; i++) {
                    const day = state.lessons[i];

                    for (let j = 0; j < day.length; j++) {
                        state.lessons[i][j].from = new Date(
                            state.lessons[i][j].from
                        ).toISOString();

                        state.lessons[i][j].to = new Date(
                            state.lessons[i][j].to
                        ).toISOString();
                    }
                }

                const currentDate = new Date();

                let foundBlock = false;
                for (let i = 0; i < state.lessons.length; i++) {
                    const block = state.lessons[i];
                    for (const lesson of block) {
                        if (
                            new Date(lesson.from).getTime() >
                            currentDate.getTime()
                        ) {
                            foundBlock = true;
                            break;
                        }
                    }

                    if (foundBlock) {
                        state.nextBlockIndex = i;
                        break;
                    }
                }

                if (!foundBlock) state.nextBlockIndex = undefined;
                console.log("foundblock" + state.nextBlockIndex);
            }
        },
        setLoadingLessons: (state, loadingLessons: PayloadAction<boolean>) => {
            state.loading = loadingLessons.payload;
        },
        setLoadingLessonsError: (
            state,
            loadingLessonsError: PayloadAction<boolean>
        ) => {
            state.error = loadingLessonsError.payload;
        },
    },
});

export const { setLessons, setLoadingLessons, setLoadingLessonsError } =
    classesSlice.actions;

export default classesSlice;
