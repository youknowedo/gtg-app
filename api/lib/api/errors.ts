import { RError } from ".";

namespace Errors {
    export const MethodNotAllowed = (method?: string): RError => {
        return {
            code: "GA-E405",
            message: `Method "${method}" is not allowed.`,
        };
    };

    export const MissingParameter = (
        parameterMissing: string,
        type?: string
    ): RError => {
        return {
            code: "GA-E422",
            message: `Parameter "${parameterMissing}" is missing or of wrong type.${
                type ? ` Required type is "${type}."` : ""
            }`,
        };
    };
}

export default Errors;
