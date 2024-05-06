import { SortDirection } from "@angular/material/sort";
import { DropdownValue } from "workspace-library";
import { AttendanceType, PendingAt } from "./Enums";

export const DEFAULT_PAGINATION = {
    pageNumber: 1,
    pageSize: 10,
    sortBy: '',
    sortDirection: 'ascending'
};

export const DEFAULT_ORDER: SortDirection = "asc";

export const GLOBAL_CONSTANTS = {

    CANCEL: 'Cancel',
    COMMON_API_ERROR_MESSAGE: 'Some error has occurred',
    CHANGE_PASSWORD: "Change Password",
    DELETE_CONFIRM_TITLE: 'Delete Confirm',
    DELETE_MESSAGE: 'Are you sure you want to delete?',
    UPDATE_STATUS_MESSAGE: 'Are you sure you want to change the status?',
    CONFIRMATION: 'Confirmation',
    NO_RECORD_FOUND: "No records found",
    OK: 'Ok',
    RESET_BUTTON: 'Reset',
    SAVE: 'Save',
    SAVE_AND_CONTINUE: 'Save & Continue',
    CONFIRM: 'Confirm',
    SAVE_ALL: 'Save All',
    UPDATE: 'Update',
    VALIDATORS: {
        EMAIL_PATTER:
            '/^(?=.{1,80}$)([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,})+$/',
    },
    SEARCH_BUTTON: 'Search',
    SUBMIT: 'Submit',
    ADD: 'Add',
    ASCENDING: 'ascending',
    DESCENDING: 'descending',
    REGULAR_EXPRESSION: {
        DIGIT: /[0-9]/,
        LATTER: /[a-zA-Z]/,
        PASSWORD: /^(?=(.*\d){1})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,20}$/,
        EMAIL: /^[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
        PHONE_NO: /^\+91[6789]\d{9}$/,
        MULTIPLE_EMAIL: /^(?:[a-z0-9._-]+@[a-z0-9.-]+\.[a-z]{2,4}(?:,\s*|$))*$/
    },
    SAVED: 'Saved.',
    UNKNOWN_ERROR: "An unknown error occurred!",
    STATUS: 'Status',
    EDIT_ICON_TOOLTIP: 'Edit',
    DELETE_ICON_TOOLTIP: 'Delete',
    INACTIVE_ICON_TOOLTIP: 'Make InActive',
    ACTIVE_ICON_TOOLTIP: 'Make Active',
    PREVIEW_ICON_TOOLTIP: 'Preview',
    HISTORY_ICON_TOOLTIP: 'History',
    VIEW_ICON_TOOLTIP: 'View',
    COMMON_EXPORT_ERROR_MESSAGE: "No records found for export",
    CANCEL_ICON_TOOLTIP: 'Cancel'
};

export const ACTIVE_INACTIVE_STATUS_LABEL = {
    ACTIVE: "Active",
    INACTIVE: "Inactive",
};

export const ACTIVE_INACTIVE_STATUS_OPTIONS: DropdownValue[] = [
    { id: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, text: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE },
    { id: ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE, text: ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE }
];
export const MODULES = {
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',
    ATTENDANCE: 'attendance',
    TEAM: 'team',
    SITTING: 'sitting',
    PRE_SALES: 'pre-sales',
    PROJECT_MANAGEMENT: 'project-management',
    RESOURCE_MANAGEMENT: 'resource-management',
    NETWORK: 'network',
    HELP_DESK: 'help-desk',
    ACCOUNT: 'account',
    DOCUMENTS: 'documents',
};

export const COMMON_ROUTES = {
    UNAUTHORIZED: 'unauthorized',
    PAGE_NOT_FOUND: '404',
    REDIRECT_TO_DASHBOARD: '/dashboard',
    REDIRECT_TO_UNAUTHORIZED: '/unauthorized'
};

export const COMMON_ICON = {
    EDIT_ICON: 'assets/images/edit-icon.svg',
    ACTIVE_ICON: 'assets/images/active-icon.svg',
    INACTIVE_ICON: 'assets/images/inactive-icon.svg',
    DELETE_ICON: 'assets/images/delete-icon.svg',
    PREVIEW_ICON: 'assets/images/preview-icon.svg',
    VIEW_ICON: 'assets/images/view.svg',
    CANCEL_ICON: 'assets/images/cancel-icon.svg',
    HISTORY_ICON: 'assets/images/history.svg'
};

export const colorOptions: DropdownValue[] = [
    { id: '1', text: '#F2CD51' },
    { id: '2', text: '#4F90FF' },
    { id: '3', text: '#C284DF' },
    { id: '4', text: '#48DA9D' },
    { id: '5', text: '#E0E0E0' },
    { id: '6', text: '#F6A0A3' },
    { id: '7', text: '#89E9E4' },
    { id: '8', text: '#FE86CF' },
    { id: '9', text: '#7F9BCC' },
    { id: '10', text: '#CBE28B' },
];

export const ATTENDANCE_OPTIONS: DropdownValue[] = [
    { id: AttendanceType.PRESENT, text: "Present" },
    { id: AttendanceType.ABSENT, text: "Absent" },
    { id: AttendanceType.HALF_Leave, text: "Half Leave" }
];

export const ALLOCATION_TYPE: DropdownValue[] = [
    { id: 0, text: 'Select Allocation Type' },
    { id: 3, text: "Full Time" },
    { id: 4, text: "Partial" }
];

export const TYPE: DropdownValue[] = [
    { id: 0, text: 'Select Type' },
    { id: 1, text: "Daily" },
    { id: 2, text: "Weekly" },
    { id: 3, text: "Monthly" }
];

export const EMPLOYEE_STATUS: DropdownValue[] = [
    { id: 1, text: "Active" },
    { id: 0, text: "InActive" },
];
export const PENDING_AT: DropdownValue[] = [
    { id: PendingAt.ALL, text: "All" },
    { id: PendingAt.ASSIGN_TO_MY_TEAM, text: "Assign To My Team" },
    { id: PendingAt.ASSIGN_TO_ME, text: "Assign To Me" },
];

export const MaxDisplayOrder: number = 99999;

export const LOOKUP_CATEGORY_ID = {
    COUNTRY: 18,
    PRESALES_INQUIRY_SOURCE: 39,
    PRESALES_TYPE: 62,
    PRESALES_CLOSED_REASON: 40
};

export const THEME_LABEL = {
    DARK: 'Dark Mode',
    LIGHT: 'Light Mode'
};

export const EMPLOYEE_WORK_STATUS = [
    { id: "", text: "Select Employee Work Status" },
    { id: "Completely Assigned", text: "Completely Assigned" },
    { id: "Partial Free", text: "Partial Free" },
    { id: "Fulltime Free", text: "Fulltime Free" }
];
export const EDIT_STATUS_LABEL = {
    EDITABLE: "Yes",
    NON_EDITABLE: "No",
};

export const EDIT_STATUS_OPTIONS: DropdownValue[] = [
    { id: EDIT_STATUS_LABEL.EDITABLE, text: EDIT_STATUS_LABEL.EDITABLE },
    { id: EDIT_STATUS_LABEL.NON_EDITABLE, text: EDIT_STATUS_LABEL.NON_EDITABLE }
];
