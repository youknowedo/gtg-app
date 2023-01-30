import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import { Skola24Object } from "skola24";
import { RootState } from "../../store";
import { setClasses, setLoadingClasses } from "../redux/classesSlice";
import { getLessons } from "./lessons";
import { getSchoolYear } from "./schoolYear";

export const getClasses = async (dispatch: Dispatch<AnyAction>) => {
    const response = await fetch(
        "https://gtg.seabird.digital/api/schedule/classes",
        {
            mode: "no-cors",
        }
    );

    const data = (await response.json()).data as Skola24Object[];

    dispatch(setClasses(data));
    getSchoolYear(dispatch);
};
