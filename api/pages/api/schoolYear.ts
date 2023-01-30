import { NextApiRequest } from "next";
import Skola24, { SchoolYear } from "skola24";
import { ApiResponse } from "../../lib/api";
import Errors from "../../lib/api/errors";

const schoolYear = async (
    req: NextApiRequest,
    res: ApiResponse<SchoolYear>
) => {
    if (req.method == "GET") {
        const session = await Skola24.connect(
            "goteborgstekniskacollege.skola24.se"
        );

        const data = await session.getSchoolYear(session.cookies);

        res.status(200).json({
            data,
        });

        return;
    }

    res.status(405).json({
        error: Errors.MethodNotAllowed(req.method),
    });
};

export default schoolYear;
