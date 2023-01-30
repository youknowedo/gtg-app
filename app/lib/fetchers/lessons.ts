import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Lesson, Skola24Object } from "skola24";
import store, { RootState } from "../../store";
import {
    setLessons,
    setLoadingLessons,
    setLoadingLessonsError,
} from "../redux/lessonsSlice";

export const getLessons = async (
    dispatch: Dispatch<AnyAction>,
    classes: Skola24Object[] | undefined,
    selectedIndex: number,
    selectionGuid?: string
) => {
    if (!store.getState().lessons.lessons) dispatch(setLoadingLessons(true));
    dispatch(setLoadingLessonsError(false));

    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor(
        (currentDate.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000)
    );

    const weekNumber = Math.ceil(days / 7);

    const url =
        "https://gtg.seabird.digital/api/schedule/lessons?" +
        `selectionGuid=${
            selectionGuid ?? classes?.[selectedIndex]?.groupGuid
        }` +
        `&week=${weekNumber - 1}` +
        `&day=${days % 7}` +
        `&year=2023`;
    console.log(url);
    const response = await fetch(url);
    dispatch(setLoadingLessons(false));

    if (!response.ok) {
        console.log(await response.text());
        dispatch(setLoadingLessonsError(true));

        return;
    }

    const json = await response?.json();
    console.log(url + " = " + JSON.stringify(json));
    const data = json.data as Lesson[][];

    dispatch(setLessons(data));
};
