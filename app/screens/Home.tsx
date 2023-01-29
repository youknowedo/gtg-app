import { type NativeStackScreenProps } from "@react-navigation/native-stack";
import { Divider, Layout, Text } from "@ui-kitten/components";
import React from "react";
import { ScrollView } from "react-native";
import Events from "../lib/components/Home/Events";
import Food from "../lib/components/Home/Food";
import Schedule from "../lib/components/Home/Schedule";

export const HomeScreen = (props: NativeStackScreenProps<any, "Home">) => {
    return (
        <ScrollView>
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
