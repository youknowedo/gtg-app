import Skola24, { ClassesData, Skola24Object } from "skola24";

import { NextApiRequest, NextApiResponse } from "next";
import { ApiResponse } from "../../../lib/api";
import Errors from "../../../lib/api/errors";

const classes = async (
    req: NextApiRequest,
    res: ApiResponse<Skola24Object[]>
) => {
    if (req.method == "GET") {
        const session = await Skola24.connect(
            "goteborgstekniskacollege.skola24.se"
        );

        const classes = await session.getClasses();

        res.status(200).json({
            data: classes,
        });

        return;
    }

    res.status(405).json({
        error: Errors.MethodNotAllowed(req.method),
    });
};

export default classes;
