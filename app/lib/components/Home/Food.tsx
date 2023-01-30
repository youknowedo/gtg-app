import { Card, Spinner, Tab, TabBar, Text } from "@ui-kitten/components";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../../store";
import { getFoods } from "../../fetchers/foods";
import { setFoods, setSelectedRestaurant } from "../../redux/foodsSlice";

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
    const dispatch = useDispatch();
    const { foods, selectedRestaurantIndex, loading, error } = useSelector(
        (state: RootState) => state.foods
    );

    const currentDate = new Date();
    const startDate = new Date(currentDate.getFullYear(), 0, 1);
    const days = Math.floor(
        (currentDate.valueOf() - startDate.valueOf()) / (24 * 60 * 60 * 1000)
    );

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
            </View>

            <Card>
                <View style={{ marginTop: -16, marginHorizontal: -24 }}>
                    <TabBar
                        selectedIndex={selectedRestaurantIndex}
                        onSelect={(index) => {
                            dispatch(setSelectedRestaurant(index));
                            dispatch(setFoods(undefined));
                            getFoods(dispatch, index);
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
                        ) : foods?.[days % 7]?.dishes ? (
                            foods[days % 7].dishes.map((d) => {
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
