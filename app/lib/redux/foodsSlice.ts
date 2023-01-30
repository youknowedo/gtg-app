import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FoodData } from "web/pages/api/schedule/food";

export type FoodsState = {
    foods?: FoodData[];
    selectedRestaurantIndex: number;
    loading: boolean;
    error: boolean;
};

const initialState: FoodsState = {
    foods: undefined,
    selectedRestaurantIndex: 1,
    loading: false,
    error: false,
};

const foodsSlice = createSlice({
    name: "foods",
    initialState,
    reducers: {
        setFoods: (state, newState: PayloadAction<FoodData[] | undefined>) => {
            state.foods = newState.payload;
        },
        setSelectedRestaurant: (
            state,
            selectedRestaurantIndex: PayloadAction<number>
        ) => {
            state.selectedRestaurantIndex = selectedRestaurantIndex.payload;
        },
        setLoadingFoods: (state, loadingFoods: PayloadAction<boolean>) => {
            state.loading = loadingFoods.payload;
        },
        setLoadingFoodsError: (
            state,
            loadingFoodsError: PayloadAction<boolean>
        ) => {
            state.error = loadingFoodsError.payload;
        },
    },
});

export const {
    setFoods,
    setSelectedRestaurant,
    setLoadingFoods,
    setLoadingFoodsError,
} = foodsSlice.actions;

export default foodsSlice;
