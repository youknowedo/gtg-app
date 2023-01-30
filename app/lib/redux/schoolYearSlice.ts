import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Lesson, SchoolYear as Skola24SchoolYear } from "skola24";
import { ExamData } from "web/pages/api/schedule/exams";

export type Block = Lesson[];
export type Day = Block[];
export type Week = Day[];

export type SchoolYear = Skola24SchoolYear & {
    weeks: {
        [year: number]: {
            [weekNumber: string]: Week;
        };
    };
    cachedClassGuid?: string;
};

const initialState: SchoolYear = {
    data: {
        schoolYearStart: new Date(),
        schoolYearEnd: new Date(),
    },
    weeks: {},
};

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        setSchoolYear: (state, newState: PayloadAction<SchoolYear>) => {
            state = newState.payload;
        },
        setWeek: (
            state,
            data: PayloadAction<{
                year: number;
                weekNumber: number;
                week: Week;
            }>
        ) => {
            const { year, weekNumber, week } = data.payload;

            state.weeks[year][weekNumber] = week;
        },
        setCachedClassGuid: (state, data: PayloadAction<string>) => {
            state.cachedClassGuid = data.payload;
        },
    },
});

export const { setSchoolYear, setWeek, setCachedClassGuid } =
    eventsSlice.actions;

export default eventsSlice;
