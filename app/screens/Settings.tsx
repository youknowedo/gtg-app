import {
    Icon,
    IndexPath,
    Layout,
    Select,
    SelectItem,
    Text,
} from "@ui-kitten/components";
import React, { useEffect } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedClass } from "../lib/redux/classesSlice";
import { RootState } from "../store";

const SettingsScreen = () => {
    const dispatch = useDispatch();
    const { classes, selectedIndex } = useSelector(
        (state: RootState) => state.classes
    );

    useEffect(() => {
        console.log(classes);
    }, []);

    return (
        <Layout
            style={{ paddingHorizontal: 16, paddingVertical: 24 }}
            level="1"
        >
            <Text style={{ marginBottom: 8 }} category={"h1"}>
                Inställningar
            </Text>

            <View
                style={{
                    marginBottom: 4,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text category={"h6"}>Klass</Text>
                <Icon
                    style={{ width: 28, height: 28 }}
                    name="arrow-ios-forward-outline"
                />
            </View>
            <Select
                selectedIndex={new IndexPath(selectedIndex)}
                value={classes?.[selectedIndex]?.groupName}
                onSelect={(index) => {
                    dispatch(setSelectedClass((index as IndexPath).row));
                }}
            >
                {classes?.map((c) => {
                    return <SelectItem title={c.groupName} />;
                })}
            </Select>
        </Layout>
    );
};

export default SettingsScreen;
