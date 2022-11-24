import axios from "axios";
import { load } from "cheerio";
import { NextApiRequest } from "next";
import { ApiResponse } from "../../../lib/api";
import Errors from "../../../lib/api/errors";

const weekExp = /v.([1-5]){1,2}/;
const dayExp = /(.){3}[ ]/;

const exams = async (req: NextApiRequest, res: ApiResponse<unknown>) => {
    if (req.method == "GET") {
        const schedule = await axios.get(
            "https://www.gtc.com/provschema/kalender.asp?klass=T1c",
            {
                responseType: "text",
            }
        );
        const $ = load(schedule.data);

        const days = $("tr td")
            .map((_, d) => $(d))
            .toArray();

        const texts: string[][] = [];
        for (const d of days) {
            const ts = d.contents().toArray();

            let notEmptyTexts: string[] = [];
            for (const t of ts) {
                let text = $(t).text().trim();

                if (dayExp.test(text)) text = text.substring(4);

                if (text != "" && !weekExp.test(text)) notEmptyTexts.push(text);
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
