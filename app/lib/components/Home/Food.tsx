import { Card, Icon, Spinner, Tab, TabBar, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View } from "react-native";

type FoodData = {
    date: Date;
    dishes: Dish[];
};

type Dish = {
    type?: string;
    name?: string;

    price?: number;
    allergies?: string;
};

const Food = () => {
    const [food, setFood] = useState<FoodData[] | undefined>(undefined);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);

    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor(
        (currentDate.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000)
    );

    const getFood = async (index: number) => {
        setFood(undefined);
        setLoading(true);
        setError(false);

        const url =
            "https://gtg.seabird.digital/api/schedule/food" +
            `?restaurant=${["ra", "tp", "rh"][index]}`;
        const response = await fetch(url);

        if (!response.ok) {
            setError(true);
            setLoading(false);

            return;
        }

        const text = await response.text();
        console.log(url + " = " + text);
        const json = JSON.parse(text);
        const data = json.data as FoodData[];

        setFood(data);
        setLoading(false);
    };

    useEffect(() => {
        getFood(0).then(() => {});
    }, []);

    return (
        <>
            <View
                style={{
                    marginBottom: 8,
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                <Text category={"h6"}>Mat</Text>
                <Icon
                    style={{ width: 28, height: 28 }}
                    name="arrow-ios-forward-outline"
                />
            </View>

            <Card>
                <View style={{ marginTop: -16, marginHorizontal: -24 }}>
                    <TabBar
                        selectedIndex={selectedIndex}
                        onSelect={(index) => {
                            setSelectedIndex(index);
                            getFood(index).then(() => {});
                        }}
                    >
                        <Tab style={{ paddingVertical: 8 }} title="Äran" />
                        <Tab title="Träffpunkten" />
                        <Tab title="Höjden" />
                    </TabBar>
                    <View style={{ paddingHorizontal: 24 }}>
                        {loading ? (
                            <View style={{ alignItems: "center" }}>
                                <Spinner />
                            </View>
                        ) : food?.[days % 7]?.dishes ? (
                            food[days % 7].dishes.map((d) => {
                                return (
                                    <Card style={{ marginVertical: 4 }}>
                                        <View
                                            style={{
                                                flexDirection: "row",
                                                justifyContent: "space-between",
                                            }}
                                        >
                                            <Text
                                                category={"s1"}
                                                style={{ width: "75%" }}
                                            >
                                                {d.name ?? ""}
                                            </Text>
                                            <Text category={"p1"}>
                                                {d.price ? `${d.price}kr` : ""}
                                            </Text>
                                        </View>
                                        <Text
                                            category={"s1"}
                                            appearance={"hint"}
                                        >
                                            {d.type ?? ""}{" "}
                                            {d.allergies
                                                ? `(${d.allergies})`
                                                : ""}
                                        </Text>
                                    </Card>
                                );
                            })
                        ) : (
                            <Card>
                                <Text>
                                    {error
                                        ? "Sum ting wong"
                                        : "Menyn för idag inte tillgänglig"}
                                </Text>
                            </Card>
                        )}
                    </View>
                </View>
            </Card>
        </>
    );
};

export default Food;
