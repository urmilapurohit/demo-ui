export interface BaseResponseModel<T> {
    isSuccess: boolean;
    data: T;
    statusCode: number;
    message: string;
    errorMessages: string[];
}

export interface IPaginationParams {
    pageNumber: number;
    pageSize: number;
    sortBy: string;
    sortDirection: string;
}

export interface IDialogOptions {
    title: string;
    width?: string;
    bodyMessage: string;
    showConfirmBtn?: boolean;
    confirmBtnName?: string;
    confirmCallBackAction?: string;
    showCancelBtn?: boolean;
    cancelBtnName?: string;
    cancelCallBackAction?: string;
    showCustomBtn?: boolean;
    customBtnName?: string;
    customBtnClassname?: string;
    customBtnCallback?: () => void
}

export interface BaseResponse<TData> {
    isSuccess?: boolean;
    data?: TData;
    statusCode?: number;
    message?: string;
    errorMessages?: any[];
}

export interface BaseSearchRequest {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: string;
    search?: string;
}

export interface ISidebarData {
    id: number;
    menuName: string;
    iconCssClass: string;
    pageUrl: string
    level: number;
    childrenPages: ISidebarData[];
}

export interface ISidebarActivePanelData {
    id: number;
    menuName: string;
    pageUrl: string
    level: number;
}

export interface IPageRights {
    modulePageId: number;
    pageAccessTypeId: number
}

export interface IPermissionData {
    pageAccess: IPageAccessObject
    memberDetails: IUserDetails;
}

export interface IUserDetails {
    memberName: string;
    profilePhoto: IProfilePhoto | null;
    email: string;
    themeColorId: number;
}
export interface IProfilePhoto {
    contentType: string,
    fileDownloadName: string,
    enableRangeProcessing: boolean,
    fileLength: number,
    fileContents: string
}
export interface IPageAccessObject {
    sideMenuPages: ISidebarData[];
    pageRights: IPageRights[];
}

export interface IRoutePermission {
    pageId: number;
    permission: number[];
}
export interface BreadcrumbItem {
    label: string;
    link: string;
}

export interface CkEditor extends FormField {
    placeholder?: string;
    keyup?: (event: KeyboardEvent) => void;
    customClass?: string;
}

export interface FormField {
    formControlName: string;
    label: string;
    customFormFieldClass?: string;
    customSelectClass?: string;
    isRequired?: boolean;
}

export interface PageAccessPermission {
    isViewPermission: boolean;
    isAddPermission: boolean;
    isEditPermission: boolean;
    isDeletePermission: boolean;
    isExportPermission: boolean;
}
