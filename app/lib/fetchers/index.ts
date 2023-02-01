import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { Skola24Object } from "skola24";
import store, { RootState } from "../../store";
import { getClasses } from "./classes";
import { getEvents } from "./events";
import { getFoods } from "./foods";
import { getLessons } from "./lessons";

export const getAll = async (
    dispatch: Dispatch<AnyAction>,
    classes: Skola24Object[] | undefined,
    selectedClassIndex: number,
    selectedRestaurantIndex: number
) => {
    await getClasses(dispatch);
    await getLessons(dispatch, classes, selectedClassIndex);
    await getEvents(dispatch);
    await getFoods(dispatch, selectedRestaurantIndex);
};
