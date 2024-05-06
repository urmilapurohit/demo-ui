export interface IPageRightsObject {
    id: number;
    parentModulePageId: number | null;
    menuName: string;
    displayOrder: number;
    level: number;
    pageAccessTypeResponse: IPageAccessTypes[];
}
export interface IPageAccessTypes {
    memberId: number | null;
    designationId: number | null;
    modulePageAccessTypeId: number;
    pageAccessTypeId: number;
    modulePageRightPageAccessTypeId: number;
    modulePageRightID: number;
    isAllowedAccessPage: boolean;
}

export interface IPageRightsSaveModel {
    designationId: number;
    modulePageAccessRequestList: IPageAccessRequestList[]
}
export interface IPageAccessRequestList {
    modulePageId: number;
    pageAccessTypeIds: number[]
}
export interface IPermission {
    id: number;
    name: string;
}
