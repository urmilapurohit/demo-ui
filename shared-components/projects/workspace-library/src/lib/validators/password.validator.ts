import { GLOBAL_CONSTANTS } from "../models/constants";

export function PasswordValidator(control: any) {
    const value: string = control?.value;
    if (GLOBAL_CONSTANTS.REGULAR_EXPRESSION.PASSWORD.test(value)) {
        return null;
    }
    return { invalidPassword: true };
}
