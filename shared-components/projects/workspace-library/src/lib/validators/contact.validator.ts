import { GLOBAL_CONSTANTS } from "../models/constants";

export function ContactValidator(control: any) {
    const value: string = control?.value;
    if (GLOBAL_CONSTANTS.REGULAR_EXPRESSION.CONTACT_NO.test(value)) {
        return null;
    }
    return { invalidContactNo: true };
}
