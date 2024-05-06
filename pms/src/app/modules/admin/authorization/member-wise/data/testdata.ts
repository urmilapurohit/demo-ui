import { IPageRightsObject } from "../models/memberwise.model";

export const responseData: IPageRightsObject[] = [
    {
        id: 2,
        parentModulePageId: null,
        menuName: "Admin",
        displayOrder: 1000,
        level: 1,
        pageAccessTypeResponse: [
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 94,
                pageAccessTypeId: 1,
                modulePageRightPageAccessTypeId: 1,
                modulePageRightID: 871,
                isAllowedAccessPage: true
            }
        ]
    },
    {
        id: 3,
        parentModulePageId: 2,
        menuName: "Company",
        displayOrder: 1010,
        level: 2,
        pageAccessTypeResponse: [
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 95,
                pageAccessTypeId: 1,
                modulePageRightPageAccessTypeId: 1,
                modulePageRightID: 824,
                isAllowedAccessPage: true
            },
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 96,
                pageAccessTypeId: 2,
                modulePageRightPageAccessTypeId: 2,
                modulePageRightID: 877,
                isAllowedAccessPage: true
            },
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 98,
                pageAccessTypeId: 4,
                modulePageRightPageAccessTypeId: 4,
                modulePageRightID: 896,
                isAllowedAccessPage: true
            },
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 97,
                pageAccessTypeId: 3,
                modulePageRightPageAccessTypeId: 3,
                modulePageRightID: 897,
                isAllowedAccessPage: true
            }
        ]
    }
];

export const singleResponseData: IPageRightsObject[] = [
    {
        id: 1,
        parentModulePageId: 2,
        menuName: "Company",
        displayOrder: 1010,
        level: 2,
        pageAccessTypeResponse: [
            {
                memberId: null,
                designationId: null,
                modulePageAccessTypeId: 95,
                pageAccessTypeId: 1,
                modulePageRightPageAccessTypeId: 1,
                modulePageRightID: 824,
                isAllowedAccessPage: true
            },
            {
                memberId: null,
                designationId: null,
                modulePageAccessTypeId: 96,
                pageAccessTypeId: 2,
                modulePageRightPageAccessTypeId: 2,
                modulePageRightID: 877,
                isAllowedAccessPage: true
            },
            {
                memberId: null,
                designationId: null,
                modulePageAccessTypeId: 98,
                pageAccessTypeId: 4,
                modulePageRightPageAccessTypeId: 4,
                modulePageRightID: 896,
                isAllowedAccessPage: true
            },
            {
                memberId: null,
                designationId: null,
                modulePageAccessTypeId: 97,
                pageAccessTypeId: 3,
                modulePageRightPageAccessTypeId: 3,
                modulePageRightID: 897,
                isAllowedAccessPage: true
            },
            {
                memberId: null,
                designationId: null,
                modulePageAccessTypeId: 97,
                pageAccessTypeId: 6,
                modulePageRightPageAccessTypeId: 3,
                modulePageRightID: 897,
                isAllowedAccessPage: true
            }
        ]
    }
];

export const singleResponseFalseData: IPageRightsObject[] = [
    {
        id: 1,
        parentModulePageId: 2,
        menuName: "Company",
        displayOrder: 1010,
        level: 2,
        pageAccessTypeResponse: [
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 95,
                pageAccessTypeId: 1,
                modulePageRightPageAccessTypeId: 1,
                modulePageRightID: 824,
                isAllowedAccessPage: false
            },
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 96,
                pageAccessTypeId: 2,
                modulePageRightPageAccessTypeId: 2,
                modulePageRightID: 877,
                isAllowedAccessPage: false
            },
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 98,
                pageAccessTypeId: 4,
                modulePageRightPageAccessTypeId: 4,
                modulePageRightID: 896,
                isAllowedAccessPage: false
            },
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 97,
                pageAccessTypeId: 3,
                modulePageRightPageAccessTypeId: 3,
                modulePageRightID: 897,
                isAllowedAccessPage: false
            },
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 97,
                pageAccessTypeId: 6,
                modulePageRightPageAccessTypeId: 3,
                modulePageRightID: 897,
                isAllowedAccessPage: false
            }
        ]
    }
];

export const responseViewAddData: IPageRightsObject[] = [
    {
        id: 1,
        parentModulePageId: 2,
        menuName: "Company",
        displayOrder: 1010,
        level: 2,
        pageAccessTypeResponse: [
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 95,
                pageAccessTypeId: 1,
                modulePageRightPageAccessTypeId: 1,
                modulePageRightID: 824,
                isAllowedAccessPage: true
            },
            {
                memberId: null,
                designationId: 69,
                modulePageAccessTypeId: 96,
                pageAccessTypeId: 2,
                modulePageRightPageAccessTypeId: 2,
                modulePageRightID: 877,
                isAllowedAccessPage: true
            }
        ]
    }
];
export const PermissionFormControlName = {
    VIEW: "viewPageRight_",
    ADD: "addPageRight_",
    EDIT: "editPageRight_",
    DELETE: "deletePageRight_",
    EXPORT: "exportPageRight_",
    ALL: "allPageRight_"
};

export const memberOptions = [
    { id: 1, text: 'Member 1' },
    { id: 2, text: 'Member 2' }
];

export const moduleOptions = [
    { id: 1, text: 'Dashboard' },
    { id: 2, text: 'Attendance' }
];
