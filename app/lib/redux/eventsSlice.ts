import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ExamData } from "web/pages/api/schedule/exams";

export type EventsState = {
    events?: ExamData[];
    loading: boolean;
    error: boolean;
};

const initialState: EventsState = {
    events: [],
    loading: false,
    error: false,
};

const eventsSlice = createSlice({
    name: "events",
    initialState,
    reducers: {
        setEvents: (state, newState: PayloadAction<ExamData[] | undefined>) => {
            state.events = newState.payload;
        },
        setLoadingEvents: (state, loadingEvents: PayloadAction<boolean>) => {
            state.loading = loadingEvents.payload;
        },
        setEventsLoadingError: (
            state,
            loadingErrorEvents: PayloadAction<boolean>
        ) => {
            state.error = loadingErrorEvents.payload;
        },
    },
});

export const { setEvents, setLoadingEvents, setEventsLoadingError } =
    eventsSlice.actions;

export default eventsSlice;
