import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Card, Icon, Spinner, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { ExamData } from "web/pages/api/schedule/exams";
import store, { RootState } from "../../../store";
import { setEvents } from "../../redux/eventsSlice";

const weekdays = [
    "måndag",
    "tisdag",
    "onsdag",
    "torsdag",
    "fredag",
    "lördag",
    "söndag",
];

type EventsProps = {
    screenProps: NativeStackScreenProps<any, "Home">;
};

const Events = ({ screenProps }: EventsProps) => {
    const lessons = useSelector((state: RootState) => state.lessons);
    const { events, loading, error } = useSelector(
        (state: RootState) => state.events
    );

    return (
        <>
            <View
                style={{
                    marginBottom: 4,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text category={"h6"}>Händelser</Text>
                <Icon
                    style={{ width: 28, height: 28 }}
                    name="arrow-ios-forward-outline"
                />
            </View>
            <View>
                {loading || lessons.loading ? (
                    <View style={{ alignItems: "center" }}>
                        <Spinner />
                    </View>
                ) : events && events.length > 0 ? (
                    events.map((day) => {
                        return day.exams.map((e) => {
                            return (
                                <Card
                                    accent={() => (
                                        <View
                                            style={{
                                                backgroundColor: e.typeColor,
                                                paddingVertical: 2,
                                            }}
                                        />
                                    )}
                                    style={{ marginVertical: 4 }}
                                >
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text category={"s1"}>
                                            {(e.type && e.type + ": ") +
                                                (e.name ?? "")}
                                        </Text>
                                        <Text category={"p1"}>
                                            {
                                                weekdays[
                                                    new Date(day.date).getDay()
                                                ]
                                            }
                                        </Text>
                                    </View>
                                    <Text category={"s1"} appearance={"hint"}>
                                        {e.teacher}
                                    </Text>
                                </Card>
                            );
                        });
                    })
                ) : (
                    <Card>
                        <Text>
                            {error ? "Sum ting wong" : "Inga händelser idag"}
                        </Text>
                    </Card>
                )}
            </View>
        </>
    );
};
export default Events;
