import { RError } from ".";

namespace Errors {
    export const MethodNotAllowed = (method?: string): RError => {
        return {
            code: "GA-E405",
            message: `Method "${method}" is not allowed.`,
        };
    };
}

export default Errors;
