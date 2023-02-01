import { AnyAction } from "@reduxjs/toolkit";
import { Dispatch } from "react";
import { useSelector } from "react-redux";
import { SchoolYear as Skola24SchoolYear } from "skola24";
import { RootState } from "../../store";
import {
    SchoolYear,
    setCachedClassGuid,
    setSchoolYear,
    Week,
} from "../redux/schoolYearSlice";

export const getSchoolYear = async (dispatch: Dispatch<AnyAction>) => {
    const oldSchoolYear = useSelector((state: RootState) => state.schoolYear);
    const { classes, selectedClassIndex: selectedIndex } = useSelector(
        (state: RootState) => state.classes
    );

    const schoolYearResponse = await fetch(
        "https://gtg.seabird.digital/api/schoolYear"
    );

    if (!schoolYearResponse.ok) {
        console.log(await schoolYearResponse.text());

        return;
    }

    const schoolYearJson = await schoolYearResponse?.json();
    const skola24SchoolYear = schoolYearJson.data as Skola24SchoolYear;

    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const startDate = new Date(year, 0, 1);
    const days = Math.floor(
        (currentDate.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000)
    );

    const weekNumber = Math.ceil(days / 7);

    const url =
        "https://gtg.seabird.digital/api/schedule/lessons?" +
        `selectionGuid=${classes?.[selectedIndex].groupGuid}` +
        `&week=${weekNumber}` +
        `&year=${year}`;
    const thisWeekResponse = await fetch(url);

    if (!thisWeekResponse.ok) {
        console.log(await thisWeekResponse.text());

        return;
    }

    const thisWeekJson = await thisWeekResponse?.json();
    const week = thisWeekJson.data as Week;

    const sameClassAsOld =
        oldSchoolYear.cachedClassGuid == classes?.[selectedIndex].groupGuid;

    const schoolYear: SchoolYear = {
        data: skola24SchoolYear.data,
        weeks: {
            ...(sameClassAsOld && oldSchoolYear.weeks),
            [year]: {
                ...oldSchoolYear.weeks[year],
                [weekNumber]: week,
            },
        },
    };
    dispatch(setSchoolYear(schoolYear));

    !sameClassAsOld &&
        classes?.[selectedIndex].groupGuid &&
        dispatch(setCachedClassGuid(classes?.[selectedIndex].groupGuid));
};
