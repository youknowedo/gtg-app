import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Lesson } from "skola24";

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
