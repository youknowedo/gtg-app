import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { useSelector } from "react-redux";
import { RootState } from "../../store";
import { getClasses } from "./classes";
import { getEvents } from "./events";
import { getFoods } from "./foods";
import { getLessons } from "./lessons";

export const getAll = async (dispatch: Dispatch<AnyAction>) => {
    const { selectedRestaurantIndex } = useSelector(
        (state: RootState) => state.foods
    );
    const { classes, selectedIndex } = useSelector(
        (state: RootState) => state.classes
    );

    getClasses(dispatch);
    getEvents(dispatch);
    getFoods(dispatch, selectedRestaurantIndex);
    getLessons(dispatch, classes, selectedIndex);
};
