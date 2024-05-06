export const AUTH_ROUTES = {
    LOGIN: '/open/login',
    VALIDATE: '/open/validate-token',
    FORGOT_PASSWORD: '/open/forgot-password',
    CHANGE_PASSWORD: '/account/change-password',
    LOGOUT: '/account/logout',
    REFRESH_TOKEN: '/open/refresh-token'
};

export const GLOBAL_CONSTANTS = {
    CANCEL: 'Cancel',
    CHANGE_PASSWORD: "Change Password",
    DATE_FORMATE: {
        YYYY_MM_DD: "YYYY-MM-DD",
        DD_MM_YYYY: "DD/MM/YYYY",
        DD_MMM_YYYY: "DD-MMM-YYYY",
        DD_MMM_YYYY_HH_MM: 'DD/MMM/YYYY HH:mm',
        DD_MMM_YYYY_WITHOUT_HH_MM: 'DD/MMM/YYYY',
        MMM_YYYY: 'MMM-YYYY',
        DD_MMM_YYYY_HH_MM_A: 'DD-MMM-YYYY HH:mm A',
    },
    DELETE_MESSAGE: 'Are you sure you want to delete?',
    EXPORT: 'Export',
    MONTH_NAMES_LIST: [
        { id: 1, monthName: 'January' },
        { id: 2, monthName: 'February' },
        { id: 3, monthName: 'March' },
        { id: 4, monthName: 'April' },
        { id: 5, monthName: 'May' },
        { id: 6, monthName: 'June' },
        { id: 7, monthName: 'July' },
        { id: 8, monthName: 'August' },
        { id: 9, monthName: 'September' },
        { id: 10, monthName: 'October' },
        { id: 11, monthName: 'November' },
        { id: 12, monthName: 'December' }
    ],
    NO_RECORD_FOUND: "No records found",
    OK: 'Ok',
    RESET: 'Reset',
    SAVE: 'Save',
    SAVE_CONFIRM_TITLE: 'Confirm',
    SAVE_ALL: 'Save All',
    UPDATE: 'Update',
    VALIDATORS: {
        EMAIL_PATTER:
            '/^(?=.{1,80}$)([a-zA-Z0-9_.+-])+@(([a-zA-Z0-9-])+.)+([a-zA-Z0-9]{2,})+$/',
        PAN_NO: '^[A-Z]{5}[0-9]{4}[A-Z]$',
    },
    SEARCH: 'Search',
    SUBMIT: 'Submit',
    APPROVE: 'Approve',
    REJECT: 'Reject',
    ADD: 'Add',
    ASCENDING: 'ascending',
    DESCENDING: 'descending',
    REGULAR_EXPRESSION: {
        DIGIT: /[0-9]/,
        LATTER: /[a-zA-Z]/,
        PASSWORD: /^(?=(.*\d){1})(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z\d]).{8,20}$/,
        CONTACT_NO: /^(?:\+91)?[6789]\d{9}$/

    },
    SAVED: 'Saved.'
};
