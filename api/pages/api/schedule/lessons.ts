import { NextApiRequest } from "next";
import Skola24, {
    Lesson,
    ParseSchedule,
    ScheduleData,
    SortSchedule,
} from "skola24";
import { ApiResponse } from "../../../lib/api";
import Errors from "../../../lib/api/errors";

type RequestData = {
    selectionGuid: string;
    week: number;
    day?: 0 | 1 | 2 | 3 | 4 | 5;
    year?: number;
    parsed?: boolean;
    sort?: boolean;
    withColors?: boolean;
};

const lessons = async (
    req: NextApiRequest,
    res: ApiResponse<ScheduleData | Lesson[]>
) => {
    if (req.method == "GET") {
        const data = req.query;

        const session = await Skola24.connect(
            "goteborgstekniskacollege.skola24.se"
        );

        const lessons = await session.getSchedule(
            data.selectionGuid as string,
            +(data.week || 0),
            data.day != undefined
                ? (+data.day as 0 | 1 | 2 | 3 | 4 | 5)
                : undefined,
            data.year != undefined ? +(data.year || 0) : undefined
        );

        if (data.parsed == "true") {
            let parsedLessons = ParseSchedule(
                lessons,
                +(data.week || 0),
                data.withColors
                    ? JSON.parse((data.withColors as string) || "")
                    : true
            );
            parsedLessons = SortSchedule(parsedLessons);

            res.status(200).json({
                data: parsedLessons,
            });
        } else {
            res.status(200).json({
                data: lessons,
            });
        }

        return;
    }

    res.status(405).json({
        error: Errors.MethodNotAllowed(req.method),
    });
};

export default lessons;
