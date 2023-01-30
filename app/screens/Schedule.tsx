import { Layout, Text } from "@ui-kitten/components";
import React from "react";
import { RefreshControl, ScrollView } from "react-native";
import { useDispatch } from "react-redux";

const ScheduleScreen = () => {
    const dispatch = useDispatch();

    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {}, []);

    return (
        <ScrollView
            refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
        >
            <Layout
                style={{ paddingHorizontal: 16, paddingVertical: 24 }}
                level="1"
            >
                <Text category={"h1"}>Översikt</Text>
            </Layout>
        </ScrollView>
    );
};

export default ScheduleScreen;
