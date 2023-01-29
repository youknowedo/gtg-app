import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { Card, Icon, Spinner, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useSelector } from "react-redux";
import store, { RootState } from "../../../store";

type ExamData = {
    date: Date;
    exams: Exam[];
};

type Exam = {
    type?: string;
    typeColor?: string;
    name?: string;
    teacher?: string;

    registered?: Date;
};

type EventsProps = {
    screenProps: NativeStackScreenProps<any, "Home">;
};

const Events = ({ screenProps }: EventsProps) => {
    const lessons = useSelector((state: RootState) => state.lessons);

    const [events, setEvents] = useState<ExamData[] | undefined>();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const getEvents = async () => {
        setEvents(undefined);
        setLoading(true);
        setError(false);

        const currentDate = new Date();
        const startDate = new Date(currentDate.getFullYear(), 0, 1);
        const days = Math.floor(
            (currentDate.valueOf() - startDate.valueOf()) /
                (24 * 60 * 60 * 1000)
        );

        const weekNumber = Math.ceil(days / 7);

        const url =
            "https://gtg.seabird.digital/api/schedule/exams" +
            `?class=${
                store.getState().classes.classes?.[
                    store.getState().classes.selectedIndex
                ]?.groupName
            }` +
            `&week=${weekNumber}`;
        console.log(url);
        const response = await fetch(url);

        if (!response.ok) {
            setError(true);
            setLoading(false);

            return;
        }

        const text = await response.text();
        console.log(url + " = " + text);
        const json = JSON.parse(text);
        const data = json.data as ExamData[];

        setEvents(data);
        setLoading(false);
    };

    useEffect(() => {
        store.subscribe(getEvents);
    }, []);

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
                                <Card style={{ marginVertical: 4 }}>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <Text category={"s1"}>{e.name}</Text>
                                        <Text category={"p1"}>
                                            {new Date(day.date).toLocaleString(
                                                "sv-SE",
                                                {
                                                    weekday: "long",
                                                }
                                            )}
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
