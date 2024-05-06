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

export interface IPagePermission {
    add?: boolean;
    delete?: boolean;
    edit?: boolean;
    pageId?: number;
    pageName?: string;
    parentPageName?: string;
    path?: string;
    view?: boolean;
}
export interface ITextBoxConfig {
    label?: string,
    formControlName?: string,
    placeholder?: string,
    type?: number,
    customClass?: string,
}

export interface IToken {
    nameid?: string,
    unique_name?: string,
    given_name?: string,
    role?: string,
    exp?: number,
    iat?: number,
    iss?: string,
    aud?: string,
    nbf?: number,
    employeeNo?: string,
    isFirstTime?: string
}
export interface IDifference {
    changedIn: string;
    old: any;
    new: any;
}
export interface ICommonDropDown {
    id?: number;
    text?: string
    value?: string;
}
