import { DropdownValue } from "workspace-library";

export const CONSTANTS = {
    DELETE_RECORD_MESSAGE: 'Are you sure you want to delete this holiday?',
};

export const HOLIDAY_TYPE_LABEL = {
    PUBLIC_HOLIDAY: "Public Holiday",
    WEEKOFF: "Week-off",
    ALL: "All"
};

export const HOLIDAY_OPTIONS: DropdownValue[] = [
    { id: HOLIDAY_TYPE_LABEL.PUBLIC_HOLIDAY, text: HOLIDAY_TYPE_LABEL.PUBLIC_HOLIDAY},
    { id: HOLIDAY_TYPE_LABEL.WEEKOFF, text: HOLIDAY_TYPE_LABEL.WEEKOFF},
    { id: HOLIDAY_TYPE_LABEL.ALL, text: HOLIDAY_TYPE_LABEL.ALL},
];
