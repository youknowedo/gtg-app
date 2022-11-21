import { NextApiResponse } from "next";

type RData<T> = {
    error?: RError;
    data?: T;
};
type RError = {
    code: string;
    message: string;
};

type ApiResponse<T> = NextApiResponse<RData<T>>;
