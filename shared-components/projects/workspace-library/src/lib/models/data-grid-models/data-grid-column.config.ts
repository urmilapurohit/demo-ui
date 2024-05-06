import { TemplateRef } from "@angular/core";
import { FormControlOptions, ValidatorFn } from "@angular/forms";
import { MatCheckboxChange } from "@angular/material/checkbox";
import { MatSelectChange } from "@angular/material/select";
import { BehaviorSubject } from "rxjs";
import { MatSlideToggleChange } from "@angular/material/slide-toggle";
import { FormFieldType } from "../form.field";
import { DropdownValue } from "../dropdown";
import { Checkbox } from "../checkbox";
import { Tooltip } from "../tooltip";

export interface DataGridColumn<T> {
    title?: string;
    field?: keyof (T) | "NA" | any;
    isSortable?: boolean;
    isHidden?: boolean;
    isStickyColumn?: boolean;
    fieldDataType?: DataGridFieldDataType;
    isNoInputRestriction?: boolean,
    customTextField?: boolean;
    fieldType?: DataGridFieldType;
    displayFormat?: string;
    style?: DataGridColumnStyle;
    editConfig?: DataGridEditColumnConfig;
    headerEditConfig?: HeaderEditConfig;
    checkCondition?: (element: T | null) => boolean;
    valueCallback?: (element?: T) => any;
    callback?: (element?: T | null) => void;
    upCallBack?:(element?: T | null) => void;
    downCallBack?:(element?: T | null) => void;
    showError?: boolean;
    showTooltip?: boolean;
    setCustomClass?: boolean;
    customToolTip?: boolean;
    customToolTipConfig?: Tooltip
    customHeaderClassName?: string;
    needToShowTDClassBasedOn?: string;
    /**
     * This property should not be null when column type is set to "Custom Render Template"
     */
    customRenderTemplate?: TemplateRef<T>;

    /**
     * This property should not be null when column type is set to "Icon"
     */
    iconImagePath?: string;
    showAsHtmlElement?: boolean;
    trueIconImagePath?: string;
    falseIconImagePath?: string;
    iconGroup?: string[];
    color?: string;
}

export interface DataGridEditColumnConfig {
    isEditable: boolean;
    controlType: FormFieldType;
    validations?: FormControlOptions | ValidatorFn | ValidatorFn[];

     /**
     * name of property from which we can get data
     */
    dataFieldKey?: string;
    dropDownData?: BehaviorSubject<DropdownValue[]>;
    dropdownSelectionChange?: (data: MatSelectChange) => void;
    checkboxChange?: (data: MatCheckboxChange, formControlName?: string) => void;
    textBoxKeyUp?: (formControlName?: string) => void;
    displayCopyBtn?: boolean;
    copyBtnClick?: (index: number) => void;
    textBoxValueChange?: (formControlName?: string) => void;
    slideToogleChange?: (event: MatSlideToggleChange, element: any) => void;
    isDisabled?: boolean;
    idFieldKey?: string;
    label?: string;
    pageAccessType?: number;
    needToShowBasedOn?: string;
}

export interface HeaderEditConfig {
    controlType: FormFieldType;
    controlConfig: Checkbox
}

export interface DataGridColumnStyle {
    width?: number;
    align?: string;
}

export enum DataGridFieldType {
    data = 1,
    link = 2,
    icon = 3,
    colorBox = 4,
    iconBoolean = 5,
    iconGroup = 6
}

export enum DataGridFieldDataType {
    string = 1,
    number = 2,
    date = 3,
    dateTime = 4,
    currency = 5,
    CustomRenderTemplate = 6,
    boolean = 7,
    icon = 8,
}
