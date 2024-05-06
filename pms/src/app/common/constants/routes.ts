export const ROUTES = {
    ADMIN: {
        DEPARTMENT: {
            DEPARTMENT: 'department',
            ADD_DEPARTMENT: 'department/add',
            EDIT_DEPARTMENT: 'department/edit/:id',
            ADD_DEPARTMENT_ABSOLUTE: '/admin/department/add',
            EDIT_DEPARTMENT_ABSOLUTE: '/admin/department/edit',
            DEPARTMENT_ABSOLUTE: '/admin/department',
        },
        HOLIDAY: {
            HOLIDAY: 'holiday',
            ADD_WEEKOFF: 'weekoff/add',
            ADD_HOLIDAY_ABSOLUTE: '/admin/holiday/add',
            ADD_WEEKOFF_ABSOLUTE: '/admin/holiday/weekoff/add',
            EDIT_HOLIDAY_ABSOLUTE: '/admin/holiday/edit',
            HOLIDAY_ABSOLUTE: '/admin/holiday'
        },
        BOOK_CATEGORY: {
            BOOK_CATEGORY: 'book-category',
            ADD_BOOK_CATEGORY: 'book-category/add',
            EDIT_BOOK_CATEGORY: 'book-category/edit/:id',
            ADD_BOOK_CATEGORY_ABSOLUTE: '/admin/book-category/add',
            EDIT_BOOK_CATEGORY_ABSOLUTE: '/admin/book-category/edit',
            BOOK_CATEGORY_ABSOLUTE: '/admin/book-category'
        },
        PROJECT_GROUP: {
            PROJECT_GROUP: 'project-group',
            ADD_PROJECT_GROUP: 'project-group/add',
            EDIT_PROJECT_GROUP: 'project-group/edit/:id',
            ADD_PROJECT_GROUP_ABSOLUTE: '/project-management/project-group/add',
            EDIT_PROJECT_GROUP_ABSOLUTE: '/project-management/project-group/edit',
            PROJECT_GROUP_ABSOLUTE: '/project-management/project-group',
        },
        DOCUMENT_CATEGORY: {
            DOCUMENT_CATEGORY: 'document-category',
            ADD_DOCUMENT_CATEGORY: 'document-category/add',
            EDIT_DOCUMENT_CATEGORY: 'document-category/edit/:id',
            ADD_DOCUMENT_CATEGORY_ABSOLUTE: '/admin/document-category/add',
            EDIT_DOCUMENT_CATEGORY_ABSOLUTE: '/admin/document-category/edit',
            DOCUMENT_CATEGORY_ABSOLUTE: '/admin/document-category'
        },
        DESIGNATION: {
            DESIGNATION: 'designation',
            ADD_DESIGNATION: 'designation/add',
            EDIT_DESIGNATION: 'designation/edit/:id',
            ADD_DESIGNATION_ABSOLUTE: '/admin/designation/add',
            EDIT_DESIGNATION_ABSOLUTE: '/admin/designation/edit',
            DESIGNATION_ABSOLUTE: '/admin/designation',
        },
        LOOKUP_CATEGORY_DETAIL: {
            LOOKUP_CATEGORY_DETAIL: 'category-detail',
            ADD_LOOKUP_CATEGORY_DETAIL: 'category-detail/add',
            EDIT_LOOKUP_CATEGORY_DETAIL: 'category-detail/edit/:id',
            ADD_LOOKUP_CATEGORY_DETAIL_ABSOLUTE: '/admin/lookup/category-detail/add',
            EDIT_LOOKUP_CATEGORY_DETAIL_ABSOLUTE: '/admin/lookup/category-detail/edit',
            LOOKUP_CATEGORY_DETAIL_ABSOLUTE: '/admin/lookup/category-detail',
        },
        LOOKUP_CATEGORY: {
            LOOKUP: 'lookup',
            LOOKUP_CATEGORY: 'category',
            LOOKUP_CATEGORY_ABSOLUTE: '/admin/lookup/category'
        },
        BOOK: {
            BOOK: 'book',
            ADD_BOOK: 'book/add',
            EDIT_BOOK: 'book/edit/:id',
            ADD_BOOK_ABSOLUTE: '/admin/book/add',
            EDIT_BOOK_ABSOLUTE: '/admin/book/edit',
            BOOK_ABSOLUTE: '/admin/book'
        },
        TECHNICAL_SKILL: {
            TECHNICAL_SKILL: 'technical-skills',
            ADD_TECHNICAL_SKILL: 'technical-skills/add',
            EDIT_TECHNICAL_SKILL: 'technical-skills/edit/:id',
            ADD_TECHNICAL_SKILL_ABSOLUTE: '/admin/technical-skills/add',
            EDIT_TECHNICAL_SKILL_ABSOLUTE: '/admin/technical-skills/edit',
            TECHNICAL_SKILL_ABSOLUTE: '/admin/technical-skills'
        },
        EMAIL_TEMPLATE: {
            EMAIL_TEMPLATE: 'email-template',
            EDIT_EMAIL_TEMPLATE_ABSOLUTE: '/admin/email-template/edit',
            PREVIEW_EMAIL_TEMPLATE_ABSOLUTE: '/admin/email-template/preview',
            EMAIL_TEMPLATE_ABSOLUTE: '/admin/email-template',
        },
        AUTHORIZE: {
            AUTHORIZE: 'authorize',
            DESIGNATION_WISE: {
                DESIGNATION_WISE: 'designation-wise',
                DESIGNATION_WISE_ABSOLUTE: '/admin/authorize/designation-wise'
            },
            MEMBER_WISE: {
                MEMBER_WISE: 'member-wise',
                MEMBER_WISE_ABSOLUTE: '/admin/authorize/member-wise'
            }
        },
        ERROR_LOG: {
            ERROR_LOG: 'error-log',
            ERROR_LOG_DETAILS: 'error-log/preview',
            ERROR_LOG_DETAILS_ABSOLUTE: '/admin/error-log/preview',
            ERROR_LOG_ABSOLUTE: '/admin/error-log',
        },
        AUDIT_LOG: {
            AUDIT_LOG: 'audit-log',
            AUDIT_LOG_ABSOLUTE: '/admin/audit-log',
        },
        DOCUMENT: {
            DOCUMENT: 'document',
            ADD_DOCUMENT: 'document/add',
            EDIT_DOCUMENT: 'document/edit/:id',
            ADD_DOCUMENT_ABSOLUTE: '/admin/document/add',
            EDIT_DOCUMENT_ABSOLUTE: '/admin/document/edit',
            DOCUMENT_ABSOLUTE: '/admin/document'
        },
        APPLICATION_CONFIGURATION: {
            APPLICATION_CONFIGURATION: 'application-configuration',
            APPLICATION_CONFIGURATION_ABSOLUTE: '/admin/application-configuration',
            EDIT_APPLICATION_CONFIGURATION: 'application-configuration/edit/:id',
            EDIT_APPLICATION_CONFIGURATION_ABSOLUTE: '/admin/application-configuration/edit',
        },
        NEWS_EVENT: {
            NEWS_EVENT: 'news-event',
            NEWS_EVENT_ABSOLUTE: '/admin/news-event',
            ADD_NEWS_EVENT_ABSOLUTE: '/admin/news-event/add',
            EDIT_NEWS_EVENT_ABSOLUTE: '/admin/news-event/edit'
        },
        NOTIFICATION_TYPE: {
            NOTIFICATION_TYPE: 'notification-type',
            NOTIFICATION_TYPE_ABSOLUTE: '/admin/notification-type',
            ADD_NOTIFICATION_TYPE: 'notification-type/add',
            ADD_NOTIFICATION_TYPE_ABSOLUTE: '/admin/notification-type/add',
            EDIT_NOTIFICATION_TYPE: 'notification-type/edit',
            EDIT_NOTIFICATION_TYPE_ABSOLUTE: '/admin/notification-type/edit',
        },
        NOTIFICATION: {
            NOTIFICATION: 'notification',
            NOTIFICATION_ABSOLUTE: '/admin/notification',
            ADD_NOTIFICATION: 'notification/add',
            ADD_NOTIFICATION_ABSOLUTE: '/admin/notification/add',
            EDIT_NOTIFICATION: 'notification/edit',
            EDIT_NOTIFICATION_ABSOLUTE: '/admin/notification/edit',
        }
    },
    PROJECT_MANAGEMENT: {
        CONFIGURE: {
            GROUP: {
                GROUP: 'configure/group',
                ADD_GROUP: 'configure/group/add',
                EDIT_GROUP: 'configure/group/edit/:id',
                ADD_GROUP_ABSOLUTE: '/project-management/configure/group/add',
                EDIT_GROUP_ABSOLUTE: '/project-management/configure/group/edit',
                GROUP_ABSOLUTE: '/project-management/configure/group',
            },
            TYPE: {
                TYPE: 'configure/type',
                ADD_TYPE: 'configure/type/add',
                EDIT_TYPE: 'configure/type/edit/:id',
                ADD_TYPE_ABSOLUTE: '/project-management/configure/type/add',
                EDIT_TYPE_ABSOLUTE: '/project-management/configure/type/edit',
                TYPE_ABSOLUTE: '/project-management/configure/type',
            },
            STATUS: {
                STATUS: 'configure/status',
                ADD_STATUS: 'configure/status/add',
                EDIT_STATUS: 'configure/status/edit/:id',
                ADD_STATUS_ABSOLUTE: '/project-management/configure/status/add',
                EDIT_STATUS_ABSOLUTE: '/project-management/configure/status/edit',
                STATUS_ABSOLUTE: '/project-management/configure/status',
            },
            PROJECT_ROLE: {
                PROJECT_ROLE: 'configure/role',
                ADD_PROJECT_ROLE: 'configure/role/add',
                EDIT_PROJECT_ROLE: 'configure/role/edit/:id',
                ADD_PROJECT_ROLE_ABSOLUTE: '/project-management/configure/role/add',
                EDIT_PROJECT_ROLE_ABSOLUTE: '/project-management/configure/role/edit',
                PROJECT_ROLE_ABSOLUTE: '/project-management/configure/role',
            },
            PROJECT_SDLC: {
                SDLC_TYPE: 'configure/sdlc-type',
                SDLC_TYPE_ABSOLUTE: '/project-management/configure/sdlc-type',
                ADD_SDLC_TYPE: 'configure/sdlc-type/add',
                ADD_SDLC_TYPE_ABSOLUTE: '/project-management/configure/sdlc-type/add',
                EDIT_SDLC_TYPE: 'configure/sdlc-type/edit',
                EDIT_SDLC_TYPE_ABSOLUTE: '/project-management/configure/sdlc-type/edit',
                ADD_SDLC_WORK_FLOW_STEP: 'edit/:id/sdlc-work-flow-step/add',
                ADD_SDLC_WORK_FLOW_STEP_ABSOLUTE: '/project-management/configure/sdlc-type/edit/:id/sdlc-work-flow-step/add',
                EDIT_SDLC_WORK_FLOW_STEP: 'edit/:id/sdlc-work-flow-step/edit/:stepId',
                EDIT_SDLC_WORK_FLOW_STEP_ABSOLUTE: '/project-management/configure/sdlc-type/edit/:id/sdlc-work-flow-step/edit/:stepId',
                ADD_SDLC_WORK_FLOW_TYPE: 'edit/:id/sdlc-work-flow-type/add',
                ADD_SDLC_WORK_FLOW_TYPE_ABSOLUTE: '/project-management/configure/sdlc-type/edit/:id/sdlc-work-flow-type/add',
                EDIT_SDLC_WORK_FLOW_TYPE: 'edit/:id/sdlc-work-flow-type/edit/:typeId',
                EDIT_SDLC_WORK_FLOW_TYPE_ABSOLUTE: '/project-management/configure/sdlc-type/edit/:id/sdlc-work-flow-type/edit/:typeId',
            }
        }
    },
    PRE_SALES: {
        CONFIGURATION: {
            TECHNOLOGY: {
                TECHNOLOGY: 'configure/technology',
                ADD_TECHNOLOGY_ABSOLUTE: '/pre-sales/configure/technology/add',
                EDIT_TECHNOLOGY_ABSOLUTE: '/pre-sales/configure/technology/edit',
                TECHNOLOGY_ABSOLUTE: '/pre-sales/configure/technology'
            },
            STATUS: {
                STATUS: 'configure/status',
                ADD_STATUS: 'configure/status/add',
                EDIT_STATUS: 'configure/status/edit/:id',
                ADD_STATUS_ABSOLUTE: '/pre-sales/configure/status/add',
                EDIT_STATUS_ABSOLUTE: '/pre-sales/configure/status/edit',
                STATUS_ABSOLUTE: '/pre-sales/configure/status'
            },
            MEMBER_ROLE: {
                MEMBER_ROLE: 'configure/member-role',
                ADD_MEMBER_ROLE_ABSOLUTE: '/pre-sales/configure/member-role/add',
                EDIT_MEMBER_ROLE_ABSOLUTE: '/pre-sales/configure/member-role/edit',
                MEMBER_ROLE_ABSOLUTE: '/pre-sales/configure/member-role'
            },

        },
        INQUIRY: {
            INQUIRY: 'inquiry',
            ADD_INQUIRY: 'pre-sales/inquiry/add',
            EDIT_INQUIRY: 'pre-sales/inquiry/edit',
            HISTORY: 'history/:id',
            INQUIRY_ABSOLUTE: '/pre-sales/inquiry',
            ADD_INQUIRY_ABSOLUTE: '/pre-sales/inquiry/add',
            EDIT_INQUIRY_ABSOLUTE: '/pre-sales/inquiry/edit',
            HISTORY_ABSOLUTE: '/pre-sales/inquiry/history'
        }
    },
    NETWORK: {
        CONFIGURATION: {
            ITEM_TYPE: {
                ITEM_TYPE: 'configure/item-type',
                ADD_ITEM_TYPE: 'configure/item-type/add',
                EDIT_ITEM_TYPE: 'configure/item-type/edit/:id',
                ADD_ITEM_TYPE_ABSOLUTE: '/network/configure/item-type/add',
                EDIT_ITEM_TYPE_ABSOLUTE: '/network/configure/item-type/edit',
                ITEM_TYPE_ABSOLUTE: '/network/configure/item-type',
            },
            ITEM_MODEL: {
                ITEM_MODEL: 'configure/item-model',
                ADD_ITEM_MODEL: 'configure/item-model/add',
                EDIT_ITEM_MODEL: 'configure/item-model/edit/:id',
                ADD_ITEM_MODEL_ABSOLUTE: '/network/configure/item-model/add',
                EDIT_ITEM_MODEL_ABSOLUTE: '/network/configure/item-model/edit',
                ITEM_MODEL_ABSOLUTE: '/network/configure/item-model',
            },
            VENDOR: {
                VENDOR: 'configure/vendor',
                ADD_VENDOR: 'configure/vendor/add',
                EDIT_VENDOR: 'configure/vendor/edit/:id',
                ADD_VENDOR_ABSOLUTE: '/network/configure/vendor/add',
                EDIT_VENDOR_ABSOLUTE: '/network/configure/vendor/edit',
                VENDOR_ABSOLUTE: '/network/configure/vendor',
            },
            SYSTEM_STATUS: {
                SYSTEM_STATUS: 'configure/system-status',
                ADD_SYSTEM_STATUS: 'configure/system-status/add',
                EDIT_SYSTEM_STATUS: 'configure/system-status/edit/:id',
                ADD_SYSTEM_STATUS_ABSOLUTE: '/network/configure/system-status/add',
                EDIT_SYSTEM_STATUS_ABSOLUTE: '/network/configure/system-status/edit',
                SYSTEM_STATUS_ABSOLUTE: '/network/configure/system-status',
            },
            SYSTEM_TYPE: {
                SYSTEM_TYPE: 'configure/system-type',
                ADD_SYSTEM_TYPE: 'configure/system-type/add',
                EDIT_SYSTEM_TYPE: 'configure/system-type/edit/:id',
                ADD_SYSTEM_TYPE_ABSOLUTE: '/network/configure/system-type/add',
                EDIT_SYSTEM_TYPE_ABSOLUTE: '/network/configure/system-type/edit',
                SYSTEM_TYPE_ABSOLUTE: '/network/configure/system-type',
            }
        }
    },
    ATTENDANCE: {
        SELF: 'self',
        REGULARIZE: {
            SELF: {
                SELF: 'regularize/self',
                EDIT_SELF: 'regularize/self/edit/:id',
                EDIT_SELF_ABSOLUTE: '/attendance/regularize/self/edit',
                ADD_SELF: 'regularize/self/add',
                ADD_SELF_ABSOLUTE: '/attendance/regularize/self/add',
                SELF_ABSOLUTE: '/attendance/regularize/self'
            },
            MANAGE: {
                MANAGE: 'regularize/manage',
                EDIT_MANAGE: 'regularize/manage/edit/:id',
                EDIT_MANAGE_ABSOLUTE: '/attendance/regularize/manage/edit',
                MANAGE_ABSOLUTE: '/attendance/regularize/manage'
            },
            TEAM: {
                TEAM: 'regularize/team',
                TEAM_ABSOLUTE: '/attendance/regularize/team',
                EDIT_TEAM: 'regularize/team/edit',
                EDIT_TEAM_ABSOLUTE: '/attendance/regularize/team/edit',
            }
        },
        TEAM: {
            TEAM: 'team',
            TEAM_ABSOLUTE: '/attendance/team',
            TEAM_PENDING_ATTENDANCE: 'pending-attendance',
            TEAM_PENDING_ATTENDANCE_ABSOLUTE: '/attendance/team/pending-attendance',
        },
        MANAGE: {
            MANAGE: 'manage',
            MANAGE_ABSOLUTE: '/attendance/manage',
            MANAGE_MISSING_ATTENDANCE: 'missing-attendance',
            MANAGE_MISSING_ATTENDANCE_ABSOLUTE: '/attendance/manage/missing-attendance'
        },
        CORRECT: 'correct'
    },
    HELP_DESK: {
        CONFIGURE: {
            CATEGORY: {
                CATEGORY: 'configure/category',
                ADD_CATEGORY_ABSOLUTE: '/help-desk/configure/category/add',
                EDIT_CATEGORY_ABSOLUTE: '/help-desk/configure/category/edit',
                CATEGORY_ABSOLUTE: '/help-desk/configure/category',
                ADD_SUB_CATEGORY: 'edit/:id/sub-category/add',
                EDIT_SUB_CATEGORY: 'edit/:id/sub-category/edit/:subCategoryId'
            }
        }
    },
    DASHBOARD: {
        MEMBER_DASHBOARD_WIDGET: {
            GET_MEMBER_DASHBOARD_WIDGET: 'dashboard-widget-settings',
            GET_MEMBER_DASHBOARD_WIDGET_ABSOLUTE: '/account/dashboard-widget-settings',
        }
    },
    ACCOUNT: {
        USER: {
            USER: 'user',
            USER_ABSOLUTE: 'account/user/my-profile',
            PROFILE: 'my-profile',
            SYSTEM_CONFIGURATION: 'system-configuration/:id',
            SYSTEM_CONFIGURATION_ABSOLUTE: 'account/user/system-configuration'
        }
    },
    TEAM: {
        MANAGE: {
            MANAGE: 'manage',
        },
        CONFIGURE: {
            EFFICIENCY_REPORT: {
                EFFICIENCY_REPORT: 'configure/efficiency-report'
            }
        }
    },
    RESOURCE_MANAGEMENT: {
        MANAGE: {
            MANAGE: 'manage',
            ABSOLUTE_MANAGE: '/resource-management/manage',
            IMMEDIATE_SENIOR_HISTORY: 'immediate-senior-history/:id',
            ABSOLUTE_IMMEDIATE_SENIOR_HISTORY: 'resource-management/manage/immediate-senior-history'
        },
        HIERARCHY: {
            HIERARCHY: 'hierarchy'
        }
    },

    // common route path
    COMMON: {
        ADD: 'add',
        EDIT: 'edit/:id',
        PREVIEW: 'preview/:id'
    },
};
