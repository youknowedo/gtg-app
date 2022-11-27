import { load } from "cheerio";
import { NextApiRequest } from "next";
import { ApiResponse } from "../../../lib/api";
import Errors from "../../../lib/api/errors";

type RequestData = {
    restaurant: Restaurant;
};

type Restaurant = "tp" | "hp" | "ra";

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

const nordrestTypeExp = /^[^0-9]+/;
const nordrestNameExp = /(?<=: )[^(]+/;
const nordrestPriceExp = /[0-9]+/;
const nordrestAllergiesExp = /(?<=[(])[^)]+/;

const dishes = async (req: NextApiRequest, res: ApiResponse<FoodData[]>) => {
    if (req.method == "GET") {
        const today = new Date();

        let restaurant;
        if (
            req.query.restaurant == "tp" ||
            req.query.restaurant == "hp" ||
            req.query.restaurant == "ra"
        )
            restaurant = req.query.restaurant as Restaurant;
        else {
            res.status(422).json({
                error: Errors.MissingParameter(
                    "restaurant",
                    "'tp' | 'hp' | 'ra'"
                ),
            });

            return;
        }

        const data: RequestData = { restaurant };

        const schedule = await fetch(
            "https://volvo-cars.nordrest.se/traffpunkten/"
        );
        const $ = load(await schedule.text());

        let foodData: FoodData[] = [];

        const days = $(".menu-item").toArray();
        for (let i = 0; i < days.length; i++) {
            const d = days[i];

            const dishes: Dish[] = [];

            const ds = $(d).find("p:not(.eng-menu)").toArray();
            for (const dish of ds) {
                const texts = $(dish).text();

                const type = (nordrestTypeExp.exec(texts) || [""])[0];
                const name = (nordrestNameExp.exec(texts) || [""])[0];
                const price = (nordrestPriceExp.exec(texts) || [""])[0];
                const allergies = (nordrestAllergiesExp.exec(texts) || [""])[0];

                dishes.push({
                    type,
                    name,
                    price: +price,
                    allergies,
                });
            }
        }

        res.status(200).json({ data: foodData });

        return;
    }

    res.status(405).json({
        error: Errors.MethodNotAllowed(req.method),
    });
};

export default dishes;
