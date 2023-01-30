import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Divider, Layout, Text } from "@ui-kitten/components";
import React from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Events from "../lib/components/Home/Events";
import Food from "../lib/components/Home/Food";
import Schedule from "../lib/components/Home/Schedule";
import { getClasses } from "../lib/fetchers/classes";
import { getLessons } from "../lib/fetchers/lessons";
import { setLoadingClasses } from "../lib/redux/classesSlice";
import { setLoadingLessons } from "../lib/redux/lessonsSlice";
import { RootState } from "../store";

export const HomeScreen = (props: NativeStackScreenProps<any, "Home">) => {
    const dispatch = useDispatch();
    const { classes, selectedIndex, loading } = useSelector(
        (state: RootState) => state.classes
    );
    const lessons = useSelector((state: RootState) => state.lessons);

    const [refreshing, setRefreshing] = React.useState(0);

    const onRefresh = React.useCallback(() => {
        setRefreshing(2);

        getClasses(dispatch).then(() => setRefreshing(refreshing - 1));
        getLessons(dispatch, classes, selectedIndex).then(() =>
            setRefreshing(refreshing - 1)
        );
    }, []);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl
                    refreshing={refreshing > 0}
                    onRefresh={onRefresh}
                />
            }
        >
            <Layout
                style={{ paddingHorizontal: 16, paddingVertical: 24 }}
                level="1"
            >
                <Text style={{ marginBottom: 8 }} category={"h1"}>
                    Översikt
                </Text>

                <Schedule screenProps={props} />

                <Divider style={{ marginVertical: 24 }} />

                <Events screenProps={props} />

                <Divider style={{ marginVertical: 24 }} />

                <Food />
            </Layout>
        </ScrollView>
    );
};
