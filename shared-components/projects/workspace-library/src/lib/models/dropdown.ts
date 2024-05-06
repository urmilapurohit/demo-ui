import { Observable } from "rxjs";
import { MatSelectChange } from "@angular/material/select";
import { FormField } from "./form.field";

export interface DropDownBase {
    id: string;
    feature?: DropDownFeature;
    selectionChange?: (event: MatSelectChange, formControlName?: string) => void;
}
export interface DropDownFeature {
    isApiEnabled?: boolean;
    allowClear?: boolean;
    allowMultiple?: boolean;
    includeAllOption?: boolean;
    allOptionValue?: number;
    isColorDropDown?: boolean;
}
export interface DropDown extends FormField, DropDownBase {
    data: DropDownData;
    isSearchable?: boolean;
    onEnterPress?: () => void;
    placeHolder?: string;
}
export interface DropDownData {
    data: Array<DropdownValue>;
    dataSource?(): Observable<any>;
    valueProp?: string;
    textProp?: string;
}
export interface DropdownByClassId extends FormField, DropDownBase {
    classId: number;
}
export interface DropdownValue {
    id: number | string ;
    text: string;
}
