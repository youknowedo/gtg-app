import { AnyAction, Dispatch } from "@reduxjs/toolkit";
import { FoodData } from "web/pages/api/schedule/food";
import store from "../../store";
import {
    setFoods,
    setLoadingFoods,
    setLoadingFoodsError,
} from "../redux/foodsSlice";

export const getFoods = async (
    dispatch: Dispatch<AnyAction>,
    restaurantIndex: number
) => {
    if (!store.getState().foods.foods) dispatch(setLoadingFoods(true));
    dispatch(setLoadingFoodsError(false));

    const url =
        "https://gtg.seabird.digital/api/schedule/food" +
        `?restaurant=${["ra", "tp", "rh"][restaurantIndex]}`;
    const response = await fetch(url);

    if (!response.ok) {
        dispatch(setFoods(undefined));
        dispatch(setLoadingFoodsError(true));
        dispatch(setLoadingFoods(false));

        return;
    }

    const text = await response.text();
    console.log(url + " = " + text);
    const json = JSON.parse(text);
    const data = json.data as FoodData[];

    dispatch(setFoods(data));
    dispatch(setLoadingFoods(false));
};
