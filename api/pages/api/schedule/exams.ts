import axios from "axios";
import { load } from "cheerio";
import { NextApiRequest } from "next";
import { ApiResponse } from "../../../lib/api";
import Errors from "../../../lib/api/errors";

type RequestData = {
    selectionGuid: string;
    week: number;
    day?: 0 | 1 | 2 | 3 | 4 | 5;
    year?: number;
    parsed?: boolean;
    sort?: boolean;
    group?: boolean;
    withColors?: boolean;
};

const exams = async (req: NextApiRequest, res: ApiResponse<unknown>) => {
    if (req.method == "GET") {
        const schedule = await axios.get(
            "https://www.gtc.com/provschema/kalender.asp?klass=T1c"
        );
        const $ = load(schedule.data);

        const days = $("tr td")
            .map((_, d) => $(d))
            .toArray();

        const texts: string[][] = [];
        for (const d of days) {
            const ts = d.text().split(" ");

            let notEmptyTexts: string[] = [];
            for (const t of ts) {
                if (t != "") notEmptyTexts.push(t);
            }

            if (notEmptyTexts.length > 0) texts.push(notEmptyTexts);
        }

        res.status(200).json({ data: texts });

        return;
    }

    res.status(405).json({
        error: Errors.MethodNotAllowed(req.method),
    });
};

export default exams;
