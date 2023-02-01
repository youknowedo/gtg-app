import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Skola24Object } from "skola24";
import { RootState } from "../../store";
import {
    setClasses,
    setClassesLoadingError,
    setLoadingClasses,
} from "../redux/classesSlice";
import { getLessons } from "./lessons";
import { getSchoolYear } from "./schoolYear";

export const getClasses = async (dispatch: Dispatch<AnyAction>) => {
    dispatch(setClassesLoadingError(false));

    try {
        const response = await fetch(
            "https://gtg.seabird.digital/api/schedule/classes"
        );

        const data = (await response.json()).data as Skola24Object[];
        if (!response.ok) {
            console.log(await response.text());
            dispatch(setClassesLoadingError(true));

            return;
        }

        dispatch(setClasses(data));
    } catch (e) {
        console.log(e);
    }
};
