import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { ExamData } from "web/pages/api/schedule/exams";
import store from "../../store";
import {
    setEvents,
    setEventsLoadingError,
    setLoadingEvents,
} from "../redux/eventsSlice";

export const getEvents = async (dispatch: Dispatch<AnyAction>) => {
    if (!store.getState().lessons.lessons) dispatch(setLoadingEvents(true));
    dispatch(setEventsLoadingError(false));

    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor(
        (currentDate.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000)
    );

    const weekNumber = Math.ceil(days / 7);

    const url =
        "https://gtg.seabird.digital/api/schedule/exams" +
        `?class=${
            store.getState().classes.classes?.[
                store.getState().classes.selectedIndex
            ]?.groupName
        }` +
        `&week=${weekNumber}`;
    console.log(url);
    const response = await fetch(url);

    if (!response.ok) {
        dispatch(setEvents(undefined));
        setEventsLoadingError(true);
        setLoadingEvents(false);

        return;
    }

    const text = await response.text();
    console.log(url + " = " + text);
    const json = JSON.parse(text);
    const data = json.data as ExamData[];

    for (let i = 0; i < data.length; i++) {
        data[i].date = new Date(data[i].date);
    }

    dispatch(setEvents(data));
    dispatch(setLoadingEvents(false));
};
