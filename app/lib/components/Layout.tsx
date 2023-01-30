import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getAll } from "../fetchers";
import { getClasses } from "../fetchers/classes";
import { getEvents } from "../fetchers/events";
import { getLessons } from "../fetchers/lessons";

const Layout = ({
    children,
}: {
    children: string | JSX.Element | JSX.Element[] | (() => JSX.Element);
}) => {
    const dispatch = useDispatch();
    const { classes, selectedIndex } = useSelector(
        (state: RootState) => state.classes
    );

    useEffect(() => {
        getAll(dispatch);
    }, []);

    return (
        <>
            <SafeAreaView />

            {children}
        </>
    );
};

export default Layout;
