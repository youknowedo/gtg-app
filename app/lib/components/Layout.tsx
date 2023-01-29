import React, { useEffect } from "react";
import { SafeAreaView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../store";
import { getClasses } from "../fetchers/classes";
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
        getClasses(dispatch).then(() => {});
        getLessons(
            dispatch,
            classes,
            selectedIndex,
            classes?.[selectedIndex].groupGuid
        );
    }, []);

    return (
        <>
            <SafeAreaView />

            {children}
        </>
    );
};

export default Layout;
