export const API_ROUTES = {
    ADMIN: {
        DEPARTMENT: {
            GET_DEPARTMENT: '/admin/department/search',
            GET_DEPARTMENT_BY_ID: '/admin/department/',
            ADD_DEPARTMENT: '/admin/department'
        },
        HOLIDAY: {
            GET_HOLIDAY: '/admin/holiday/search',
            GET_HOLIDAY_BY_ID: '/admin/holiday/',
            ADD_HOLIDAY: '/admin/holiday',
            UPDATE_HOLIDAY: '/admin/holiday/',
            DELETE_HOLIDAY: '/admin/holiday/',
            ADD_WEEKOFF: '/admin/holiday/create-weekoffs'
        },
        BOOK_CATEGORY: {
            GET_BOOK_CATEGORY: '/admin/book-category/search',
            GET_BOOK_CATEGORY_BY_ID: '/admin/book-category/',
            ADD_BOOK_CATEGORY: '/admin/book-category',
            UPDATE_BOOK_CATEGORY: '/admin/book-category/',
            DELETE_BOOK_CATEGORY: '/admin/book-category/'
        },
        DOCUMENT_CATEGORY: {
            GET_DOCUMENT_CATEGORY: '/admin/document-category/search',
            GET_DOCUMENT_CATEGORY_BY_ID: '/admin/document-category/',
            ADD_DOCUMENT_CATEGORY: '/admin/document-category',
            UPDATE_DOCUMENT_CATEGORY: '/admin/document-category/',
            DELETE_DOCUMENT_CATEGORY: '/admin/document-category/'
        },
        LOOKUP_CATEGORY_DETAIL: {
            GET_LOOKUP_CATEGORY_DETAIL: '/admin/lookup-category-detail/search',
            GET_LOOKUP_CATEGORY: '/admin/open/lookup-category',
            GET_EDITABLE_LOOKUP_CATEGORY: '/admin/open/lookup-category-is-editable',
            GET_LOOKUP_CATEGORY_DETAIL_BY_ID: '/admin/lookup-category-detail/',
            ADD_LOOKUP_CATEGORY_DETAIL: '/admin/lookup-category-detail'
        },
        LOOKUP_CATEGORY: {
            GET_LOOKUP_CATEGORY: '/admin/lookup-category/search',
            GET_LOOKUP_CATEGORY_BY_ID: '/admin/lookup-category/'
        },
        DESIGNATION: {
            GET_DESIGNATION: '/admin/designation/search',
            GET_DESIGNATION_BY_ID: '/admin/designation/',
            DELETE_DESIGNATION: '/admin/designation/',
            UPDATE_DESIGNATION: '/admin/designation/',
            ADD_DESIGNATION: '/admin/designation'
        },
        BOOK: {
            GET_BOOK: '/admin/book/search',
            GET_BOOK_BY_ID: '/admin/book/',
            GET_BOOK_CATEGORY: '/admin/open/book-category',
            ADD_BOOK: '/admin/book'
        },
        TECHNICAL_SKILL: {
            GET_TECHNICAL_SKILL: '/admin/technical-skill/search',
            GET_TECHNICAL_SKILL_BY_ID: '/admin/technical-skill/',
            ADD_TECHNICAL_SKILL: '/admin/technical-skill'
        },
        EMAIL_TEMPLATE: {
            GET_EMAIL_TEMPLATE: '/admin/email-template/search',
            EMAIL_TEMPLATE_PREFIX: '/admin/email-template/',
        },
        AUTHORIZE: {
            DESIGNATION_WISE: {
                GET_DESIGNATIONS: '/admin/open/designation',
                GET_MODULES: '/admin/open/module-page',
                GET_PAGE_RIGHTS_BY_MODULE_DESIGNATION_ID: '/admin/module-page-right-by-designation',
                GET_ALL_PERMISSION: '/admin/open/page-access-types',
            },
            MEMBER_WISE: {
                GET_PAGE_RIGHTS_BY_MODULE_MEMBER_ID: '/admin/module-page-right-by-member'
            },
        },
        ERROR_LOG: {
            GET_ERROR_LOG: '/admin/error-log/search',
            GET_ERROR_LOG_BY_ID: '/admin/error-log/',
            DELETE_ERROR_LOG_BY_IDS: '/admin/error-log/delete-logs'
        },
        AUDIT_LOG: {
            GET_AUDIT_LOG: '/admin/auditlog/search',
            DELETE_AUDIT_LOG_BY_IDS: '/admin/auditlog/delete',
            GET_MODULES: '/admin/open/module-page',
            GET_PAGES: '/admin/open/module-pages',
            GET_TYPES: '/admin/open/lookup-category-details/67'
        },
        DOCUMENT: {
            GET_DOCUMENT: '/admin/document/search',
            GET_DOCUMENT_BY_ID: '/admin/document/',
            GET_DOCUMENT_CATEGORY: '/admin/open/document-category',
            ADD_DOCUMENT: '/admin/document',
            DOCUMENT_PREVIEW: '/admin/document/download/',
            GET_DOCUMENT_BY_SUB_CATEGORY_ID: '/admin/open/document/',
        },
        MEMBER_DASHBOARD_WIDGET: {
            MEMBER_DASHBOARD_WIDGET_PREFIX: '/admin/dashboard-widget-member',
        },
        APPLICATION_CONFIGURATION: {
            GET_APPLICATION_CONFIGURATION: '/admin/application-configuration/search',
            GET_APPLICATION_CONFIGURATION_BY_ID: '/admin/application-configuration/',
            UPDATE_APPLICATION_CONFIGURATION: '/admin/application-configuration/',
            RESET_APPLICATION_CONFIGURATION_CACHE: '/admin/application-configuration/update-cache',
        },
        NEWS_EVENT: {
            GET_NEWS_EVENT: '/admin/news-event/search',
            NEWS_EVENT_PREFIX: '/admin/news-event/',
            ADD_NEWS_EVENT: '/admin/news-event',
            FILE_PREVIEW: '/admin/news-event/download/'
        },
        NOTIFICATION_TYPE: {
            GET_NOTIFICATION_TYPE: '/admin/notification-type/search',
            NOTIFICATION_TYPE_PREFIX: '/admin/notification-type',
        },
        NOTIFICATION: {
            GET_NOTIFICATION: '/admin/notification-type-detail/search',
            NOTIFICATION_PREFIX: '/admin/notification-type-detail',
            GET_NOTIFICATION_PRIORITY: '/admin/open/lookup-category-details/66',
            GET_NOTIFICATION_TYPE_DROPDOWN: '/admin/open/notification-type',
        },
        OPEN: {
            GET_LOOKUP_CATEGORY_DETAIL_BY_ID: '/admin/open/lookup-category-details/'
        }
    },
    PROJECT_MANAGEMENT: {
        CONFIGURE: {
            PROJECT_GROUPS: {
                GET_GROUPS: '/project-management/group/search',
                GROUPS_PREFIX: '/project-management/group'
            },
            PROJECT_TYPES: {
                GET_TYPES: '/project-management/type/search',
                TYPES_PREFIX: '/project-management/type'
            },
            PROJECT_STATUS: {
                GET_STATUS: '/project-management/status/search',
                STATUS_PREFIX: '/project-management/status'
            },
            PROJECT_ROLE: {
                GET_PROJECT_ROLE: '/project-management/role/search',
                PROJECT_ROLE_PREFIX: '/project-management/role'
            },
            PROJECT_SDLC_TYPE: {
                GET_SDLC_TYPE: '/project-management/sdlc-type/search',
                SDLC_TYPE_PREFIX: '/project-management/sdlc-type',
                GET_WORK_FLOW_STEP: '/project-management/work-flow-step/search',
                WORK_FLOW_STEP_PREFIX: '/project-management/work-flow-step',
                GET_WORK_FLOW_TYPE: '/project-management/work-flow-type/search',
                WORK_FLOW_TYPE_PREFIX: '/project-management/work-flow-type',
                DOCUMENT_PREVIEW: '/project-management/work-flow-type/download/'
            }
        },
    },
    PRE_SALES: {
        CONFIGURATION: {
            TECHNOLOGY: {
                GET_TECHNOLOGY: '/pre-sales/inquiry-technology/search',
                ADD_TECHNOLOGY: '/pre-sales/inquiry-technology',
                GET_TECHNOLOGY_BY_ID: '/pre-sales/inquiry-technology/'
            },
            STATUS: {
                GET_STATUS: '/pre-sales/inquiry-status/search',
                ADD_STATUS: '/pre-sales/inquiry-status',
                GET_STATUS_BY_ID: '/pre-sales/inquiry-status/'
            },
            MEMBER_ROLE: {
                GET_MEMBER_ROLE: '/pre-sales/inquiry-member-role/search',
                ADD_MEMBER_ROLE: '/pre-sales/inquiry-member-role',
                GET_MEMBER_ROLE_ID: '/pre-sales/inquiry-member-role/',
                GET_CURRENT_MEMBER_ROLE: '/pre-sales/inquiry-member-role/get-current-member-role',
                GET_ONE_DRIVE_PATH: '/pre-sales/inquiry-member-role/get-one-drive-path/'
            }
        },
        INQUIRY: {
            GET_INQUIRY: '/pre-sales/inquiry/search',
            GET_TECHNOLOGY: '/pre-sales/open/technology',
            GET_STATUS: '/pre-sales/open/status',
            GET_MEMBER_BDE: '/pre-sales/open/member-role-bde',
            GET_MEMBER_BA: '/pre-sales/open/member-role-ba',
            ADD_INQUIRY: '/pre-sales/inquiry',
            INQUIRY_PREFIX: '/pre-sales/inquiry/',
            PERSONALIZED_VIEW_PREFIX: '/pre-sales/personalize',
            GET_SAVED_SEARCH: '/pre-sales/inquiry-search-criteria/search',
            ADD_SAVED_SEARCH: '/pre-sales/inquiry-search-criteria',
            SAVED_SEARCH_PREFIX: '/pre-sales/inquiry-search-criteria/'
        }
    },
    NETWORK: {
        CONFIGURATION: {
            ITEM_TYPE: {
                GET_ITEM_TYPE: '/network/item-type/search',
                ITEM_TYPE_PREFIX: '/network/item-type/',
                ADD_ITEM_TYPE: '/network/item-type'
            },
            ITEM_MODEL: {
                GET_ITEM_MODEL: '/network/item-model/search',
                ITEM_MODEL_PREFIX: '/network/item-model/',
                ADD_ITEM_MODEL: '/network/item-model',
                GET_ITEM_TYPE: '/network/open/item-type'
            },
            VENDOR: {
                GET_VENDOR: '/network/vendor/search',
                ADD_VENDOR: '/network/vendor',
                GET_VENDOR_BY_ID: '/network/vendor/'
            },
            SYSTEM_STATUS: {
                GET_SYSTEM_STATUS: '/network/system-status/search',
                ADD_SYSTEM_STATUS: '/network/system-status',
                GET_SYSTEM_STATUS_BY_ID: '/network/system-status/'
            },
            SYSTEM_TYPE: {
                GET_SYSTEM_TYPE: '/network/system-type/search',
                ADD_SYSTEM_TYPE: '/network/system-type',
                GET_SYSTEM_TYPE_BY_ID: '/network/system-type/',
                GET_ITEM_TYPE_LIST: '/network/open/item-type'
            }
        }
    },
    ATTENDANCE: {
        SELF: {
            GET_ATTENDANCE: '/attendance/self/get-attendances',
            SAVE_ATTENDANCE: '/attendance/self/save'
        },
        REGULARIZE: {
            SELF: {
                GET_SELF: '/attendance/self-regularization/search',
                GET_ATTENDANCE_BY_DATE: '/attendance/self-regularization/get-attendance-by-date',
                SELF_PREFIX: '/attendance/self-regularization/',
                SELF_CANCEL: '/attendance/self-regularization/cancel/',
                SELF_HISTORIES: '/attendance/self-regularization/histories/',
                SELF_STATUS: '/attendance/open/regularization-statuses/'

            },
            TEAM: {
                GET_TEAM: '/attendance/team-regularization/search',
                TEAM_PREFIX: '/attendance/team-regularization/',
                TEAM_HISTORIES: '/attendance/team-regularization/histories/'
            },
            MANAGE: {
                GET_MANAGE: '/attendance/manage-regularization/search',
                MANAGE_PREFIX: '/attendance/manage-regularization/',
                MANAGE_HISTORIES: '/attendance/manage-regularization/histories/'
            }
        },
        TEAM: {
            GET_ATTENDANCE: '/attendance/team/get-attendances',
            SAVE_ATTENDANCE: '/attendance/team/fill',
            TEAM_PENDING_ATTENDANCE: '/attendance/team/pending-attendance',
            GET_REPORTING_PERSON: '/attendance/open/reporting-member-typeahead/'
        },
        MANAGE: {
            GET_ATTENDANCE: '/attendance/manage/get-attendances',
            SAVE_ATTENDANCE: '/attendance/manage/fill',
            MISSING_ATTENDANCE: '/attendance/manage/pending-attendance',
        },
        CORRECTION: {
            SAVE_CORRECTION: '/attendance/correction',
            GET_MEMBERS: '/attendance/correction/members',
            CHECK_ATTENDANCE: '/attendance/correction/check-attendance'
        }
    },
    HELP_DESK: {
        CONFIGURE: {
            CATEGORY: {
                GET_CATEGORY: '/helpdesk/category/search',
                GET_CATEGORY_BY_ID: '/helpdesk/category',
                GET_CATEGORY_LIST: '/helpdesk/open/category',
                GET_DEPARTMENT_LIST: '/helpdesk/open/helpdesk-group',
                ADD_CATEGORY: '/helpdesk/category',
                GET_SUB_CATEGORY_LIST: '/helpdesk/category/sub-category'
            }
        }
    },
    ACCOUNT: {
        MY_PROFILE: {
            GET_PROFILE: '/account/get-profile',
            UPDATE_PROFILE: '/account/update-profile',
            GET_EMAIL_DOMAIN: '/team/open/email-domain-list'
        },
    },
    DOCUMENTS: {
        DOCUMENTS_DOWNLOAD: '/documents/download/',
    },
    TEAM: {
        MANAGE: {
            GET_TEAM_MANAGE: '/team/manage-team/list',
            GET_DESIGNATIONS: '/admin/open/designation',
            GET_PM_TEAM_LEADS: '/team/open/pm-tl/',
            GET_REPORTING_MEMBERS: '/team/open/reporting-member-dropdown',
            GET_TECHNICAL_SKILLS: '/admin/open/technical-skill',
            UPDATE_REPORTING_TO_MEMBER: '/team/manage-team/update-reporting-to-member/',
            GET_TEAM_HIERARCHY: '/team/manage-team/hierarchy',
            EXPORT_TO_EXCEL: '/team/manage-team/export-to-excel',
        },
        CONFIGURE: {
            EFFICIENCY_REPORT: {
                GET_EFFICIENCY_REPORT: '/team/efficiency-report-configuration/',
                GET_EFFICIENCY_REPORT_BY_ID: '/team/efficiency-report-configuration',
                GET_PROJECT_MANAGERS_LIST: '/team/open/project-manager-dropdown'
            }
        }
    },
    RESOURCE_MANAGEMENT: {
        HIERARCHY: {
            GET_TEAM_HIERARCHY: '/team/resource-management/hierarchy',
        },
        MANAGE: {
            GET_PM_TL: '/team/open/pm-tl/true',
            GET_RESOURCE_LIST: '/team/resource-management/list',
            GET_IMMEDIATE_SENIOR_HISTORY: '/team/resource-management/immediate-senior-history/',
            GET_PROJECT_NATURE: '/project-management/open/project-type',
            GET_PROJECT_DETAILS: '/team/resource-management/resource-project-details/',
            GET_REPORTING_MEMBERS: '/team/open/reporting-member-dropdown/true',
            UPDATE_REPORTING_TO_MEMBER: '/team/resource-management/update-reporting-to-member/'
        }
    },
    GENERAL: {
        GET_TECHNICAL_SKILLS: '/admin/open/technical-skill',
        UPDATE_MEMBER_TECHNICAL_SKILLS: '/team/manage-team/update-member-technical-skills/',
        UPDATE_USER_PREFERENCE: '/team/open/update-theme/',
        GET_MEMBERS: '/admin/open/member',
    }
};
