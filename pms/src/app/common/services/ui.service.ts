import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import moment from 'moment';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { Button, ButtonType, ButtonVariant, Checkbox, DataGridActionButton, DataGridColumn, DataGridFieldDataType, DataGridFieldType, DataGridFullRowData, DropDown, DropdownValue, GlobalService, TooltipDirection } from 'workspace-library';
import { Router } from '@angular/router';
import { BaseResponseModel, IPermissionData, IUserDetails } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_OPTIONS, COMMON_ICON, COMMON_ROUTES, GLOBAL_CONSTANTS } from '@constants/constant';
import { DateFormats } from '@constants/Enums';
import { EncryptionService } from './encryption-decryption.service';
import { ILookupCategoryDetailObject } from '../../modules/admin/lookup/lookup-category-detail/models/lookup.category.detail';

@Injectable({
    providedIn: 'root',
})
export class UIService {
    private pageSizeKey = 'pageSize';
    private permissionKey = 'permission';
    private hasCheckedAuth: boolean = false;
    private userDataSubject = new BehaviorSubject<IUserDetails | null>(null);

    constructor(
        public dialog: MatDialog,
        private cookieService: CookieService,
        private encryptionService: EncryptionService,
        private router: Router,
        private globalService: GlobalService,
    ) { }

    getPageSize(): number {
        const pageSize = this.cookieService.get(this.pageSizeKey);
        return pageSize ? +pageSize : 10;
    }

    setPageSize(pageSize: number): void {
        this.cookieService.set(this.pageSizeKey, pageSize.toString());
    }

    setAuthenticated(): void {
        this.hasCheckedAuth = true;
    }

    get hasCheckedLogin(): boolean {
        return this.hasCheckedAuth;
    }

    clearCookies(): void {
        this.cookieService.deleteAll();
    }

    setPagePermission(permission: IPermissionData) {
        this.setUserData(permission.memberDetails);
        const encrytpedPermissions = this.encryptionService.encrypt(permission);
        localStorage.setItem(this.permissionKey, JSON.stringify(encrytpedPermissions));
    }

    getPagePermission(): IPermissionData | null {
        const storedValue = localStorage.getItem(this.permissionKey);
        if (storedValue) {
            const decryptedPermission = this.encryptionService.decrypt(JSON.parse(storedValue));
            return decryptedPermission;
        }
        this.router.navigate([COMMON_ROUTES.REDIRECT_TO_UNAUTHORIZED]);
        return null;
    }

    setUserData(userData: IUserDetails): void {
        this.userDataSubject.next(userData);
    }

    getUserData(): BehaviorSubject<IUserDetails | null> {
        return this.userDataSubject;
    }

    convertDateFormat(date: string, format: DateFormats): string {
        if (date) return moment(new Date(date)).format(format);
        else return '';
    }

    toSafeString(stringValue: string | null | undefined): string {
        if (stringValue !== '' && stringValue !== null && stringValue !== undefined) return stringValue;
        else return '';
    }

    getDropdownOptions(service: Observable<BaseResponseModel<DropdownValue[]>>, includeExtraOption: boolean, extraOptionValue?: DropdownValue) {
        return service.pipe(
            map((res: BaseResponseModel<DropdownValue[]>) => {
                if (res.isSuccess && res.data) {
                    if (includeExtraOption && extraOptionValue) {
                        res.data.unshift(extraOptionValue);
                    }
                    return res.data;
                } else {
                    return [];
                }
            })
        );
    }

    getDropDownOptionsFromLookupCategory(service: Observable<BaseResponseModel<ILookupCategoryDetailObject[]>>) {
        return service.pipe(
            map((res: BaseResponseModel<ILookupCategoryDetailObject[]>) => {
                if (res.isSuccess && res.data) {
                    const dropDownOptions: DropdownValue[] = [];
                    res.data.map((value) => {
                        dropDownOptions.push({ id: value.id, text: value.name });
                        return value;
                    });
                    return dropDownOptions;
                } else {
                    return [];
                }
            })
        );
    }

    getColumnConfig(columnData: { field: string, title: string, fieldDataType: number, fieldType: number, isSortable: boolean, customHeaderClassName: string, showAsHtmlElement: boolean, trueIconImagePath: string, falseIconImagePath: string, isHidden: boolean, customRenderTemplate: any }): DataGridColumn<any> {
        const column = {
            field: columnData?.field ? columnData?.field : '',
            title: columnData?.title ? columnData?.title : '',
            fieldDataType: columnData?.fieldDataType ?? DataGridFieldDataType.string,
            fieldType: columnData?.fieldType ?? DataGridFieldType.data,
            isSortable: columnData?.isSortable ?? true,
            customHeaderClassName: columnData?.customHeaderClassName || "",
            showAsHtmlElement: columnData.showAsHtmlElement ?? false,
            isHidden: columnData.isHidden ?? false,
            trueIconImagePath: columnData?.trueIconImagePath || "",
            falseIconImagePath: columnData?.falseIconImagePath || "",
            customRenderTemplate: columnData?.customRenderTemplate || null
        };
        return column;
    }

    getSearchButtonConfig(callback: any): Button {
        return {
            id: 'searchBtn',
            buttonText: GLOBAL_CONSTANTS.SEARCH_BUTTON,
            buttonType: ButtonType.default,
            className: 'primary-btn',
            customWidthClass: 'customFullWidthClass',
            callback: () => { callback(); },
        };
    }

    getResetButtonConfig(callback: any): Button {
        return {
            id: 'resetBtn',
            buttonText: GLOBAL_CONSTANTS.RESET_BUTTON,
            buttonType: ButtonType.default,
            className: 'primary-border-btn',
            customWidthClass: 'customFullWidthClass',
            callback: () => { callback(); },
        };
    }

    getSaveButtonConfig(callback: any): Button {
        return {
            id: 'applyButton',
            buttonText: GLOBAL_CONSTANTS.SAVE,
            buttonType: ButtonType.default,
            className: 'primary-btn',
            callback: () => { callback(); },
        };
    }

    getCancelButtonConfig(callback: any): Button {
        return {
            id: 'cancelButton',
            buttonText: GLOBAL_CONSTANTS.CANCEL,
            buttonType: ButtonType.default,
            className: 'primary-border-btn',
            callback: () => { callback(); },
        };
    }

    getDeleteButtonConfig(callback: any, disable?: boolean): Button {
        return {
            id: 'deleteButton',
            buttonText: "Delete",
            buttonType: ButtonType.img,
            buttonVariant: ButtonVariant.iconOnly,
            imgUrl: '../../../../assets/images/delete-icon.svg',
            className: 'icon-btn',
            customWidthClass: '',
            tooltip: GLOBAL_CONSTANTS.DELETE_ICON_TOOLTIP,
            tooltipDirection: TooltipDirection.left,
            tooltipClass: 'custom-tooltip left-pos',
            disableCallBack: () => disable || false,
            callback: () => { callback(); }
        };
    }
    getAddButtonConfig(callback: any, tooltip: string, id: string): Button {
        return {
            id,
            buttonText: "Add Button",
            buttonType: ButtonType.img,
            buttonVariant: ButtonVariant.iconOnly,
            imgUrl: '../../../../assets/images/plus-icon-blue.svg',
            className: 'icon-btn plus-btn',
            customWidthClass: '',
            tooltip,
            tooltipDirection: TooltipDirection.left,
            tooltipClass: 'custom-tooltip left-pos',
            callback: () => { callback(); },
        };
    }
    getPreviewActionButtonConfig(callback: any): DataGridActionButton<any> {
        return {
            btnImageSrc: COMMON_ICON.PREVIEW_ICON,
            btnType: ButtonType.img,
            className: 'action-item table-icon-btn',
            tooltip: GLOBAL_CONSTANTS.PREVIEW_ICON_TOOLTIP,
            callback: (data: DataGridFullRowData<any>) => {
                callback(data);
            }
        };
    }

    getStatusFieldConfig(onEnterPress: any, isRequired?: boolean): DropDown {
        return {
            data: {
                data: ACTIVE_INACTIVE_STATUS_OPTIONS,
            },
            feature: {
                allowMultiple: false
            },
            id: 'status',
            formControlName: 'status',
            label: GLOBAL_CONSTANTS.STATUS,
            customFormFieldClass: 'custom-form-group sm-form-group',
            onEnterPress: () => { onEnterPress(); },
            isRequired: isRequired || undefined
        };
    }

    getEditActionButtonConfig(callback: any, visibleCallbackValue?: (data: any) => boolean): DataGridActionButton<any> {
        return {
            btnImageSrc: COMMON_ICON.EDIT_ICON,
            btnType: ButtonType.img,
            className: 'action-item table-icon-btn',
            tooltip: GLOBAL_CONSTANTS.EDIT_ICON_TOOLTIP,
            callback: (data: DataGridFullRowData<any>) => {
                callback(data);
            },
            visibleCallback: visibleCallbackValue
        };
    }

    getDeleteActionButtonConfig(callback: any, visibleCallbackValue?: (data: any) => boolean): DataGridActionButton<any> {
        return {
            btnImageSrc: COMMON_ICON.DELETE_ICON,
            btnType: ButtonType.img,
            className: 'action-item table-icon-btn',
            tooltip: GLOBAL_CONSTANTS.DELETE_ICON_TOOLTIP,
            callback: (data: DataGridFullRowData<any>) => {
                callback(data);
            },
            visibleCallback: visibleCallbackValue
        };
    }

    getStatusActionButtonConfig(callback: any, visibleCallbackValue?: (data: any) => boolean, booleanField?: string) {
        return {
            btnImageSrc: COMMON_ICON.INACTIVE_ICON,
            btnAlternateSrc: COMMON_ICON.ACTIVE_ICON,
            btnType: ButtonType.img,
            tooltip: GLOBAL_CONSTANTS.INACTIVE_ICON_TOOLTIP,
            isBooleanBtn: true,
            booleanField: booleanField || 'isActive',
            alterTooltip: GLOBAL_CONSTANTS.ACTIVE_ICON_TOOLTIP,
            className: 'action-item table-icon-btn',
            callback: (data: any) => {
                callback(data);
            },
            visibleCallback: visibleCallbackValue
        };
    }

    getHistoryActionButtonConfig(callback: any): DataGridActionButton<any> {
        return {
            btnImageSrc: COMMON_ICON.HISTORY_ICON,
            btnType: ButtonType.img,
            className: 'action-item table-icon-btn',
            tooltip: GLOBAL_CONSTANTS.HISTORY_ICON_TOOLTIP,
            callback: (data: DataGridFullRowData<any>) => {
                callback(data);
            }
        };
    }

    openStatusChangeModel(successCallback: any): void {
        const dialog = this.globalService.getConfirmDialog({
            bodyMessage: GLOBAL_CONSTANTS.UPDATE_STATUS_MESSAGE,
            title: GLOBAL_CONSTANTS.CONFIRMATION,
            showConfirmBtn: true,
            confirmBtnName: GLOBAL_CONSTANTS.CONFIRM,
            confirmCallBackAction: 'yes',
            showCancelBtn: true,
            cancelBtnName: GLOBAL_CONSTANTS.CANCEL,
            cancelCallBackAction: 'no'
        });
        dialog.afterClosed().subscribe((res: { data: string }) => {
            if (res?.data === 'yes') {
                successCallback();
            }
        });
    }

    openConfirmationModal(message: string, successCallback: any): void {
        const dialog = this.globalService.getConfirmDialog({
            bodyMessage: message,
            title: GLOBAL_CONSTANTS.CONFIRMATION,
            showConfirmBtn: true,
            confirmBtnName: GLOBAL_CONSTANTS.CONFIRM,
            confirmCallBackAction: 'yes',
            showCancelBtn: true,
            cancelBtnName: GLOBAL_CONSTANTS.CANCEL,
            cancelCallBackAction: 'no'
        });
        dialog.afterClosed().subscribe((res: { data: string }) => {
            if (res?.data === 'yes') {
                successCallback();
            }
        });
    }

    openDeleteConfirmationModal(message: string, successCallback: any): void {
        const dialog = this.globalService.getConfirmDialog({
            bodyMessage: message,
            title: GLOBAL_CONSTANTS.DELETE_CONFIRM_TITLE,
            showConfirmBtn: true,
            confirmBtnName: GLOBAL_CONSTANTS.CONFIRM,
            confirmCallBackAction: 'yes',
            showCancelBtn: true,
            cancelBtnName: GLOBAL_CONSTANTS.CANCEL,
            cancelCallBackAction: 'no'
        });
        dialog.afterClosed().subscribe((res: { data: string }) => {
            if (res?.data === 'yes') {
                successCallback();
            }
        });
    }
    openDeleteModel(successCallback: any): void {
        const dialog = this.globalService.getConfirmDialog({
            bodyMessage: GLOBAL_CONSTANTS.DELETE_MESSAGE,
            title: GLOBAL_CONSTANTS.CONFIRMATION,
            showConfirmBtn: true,
            confirmBtnName: GLOBAL_CONSTANTS.CONFIRM,
            confirmCallBackAction: 'yes',
            showCancelBtn: true,
            cancelBtnName: GLOBAL_CONSTANTS.CANCEL,
            cancelCallBackAction: 'no'
        });
        dialog.afterClosed().subscribe((res: { data: string }) => {
            if (res?.data === 'yes') {
                successCallback();
            }
        });
    }

    downloadFile(blob: Blob, fileName: string): void {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    }

    openFile(blob: Blob) {
        const blobUrl = URL.createObjectURL(blob);
        window.open(blobUrl, '_blank');
        window.URL.revokeObjectURL(blobUrl);
    }

    getCheckBoxConfig(label: string, formControlName: string): Checkbox {
        return {
            label,
            formControlName,
            customFormFieldClass: 'custom-form-control',
        };
    }

    getFourYearsFromNow(): DropdownValue[] {
        const currentYear = new Date().getFullYear();
        return [
            { id: currentYear, text: currentYear.toString() },
            { id: currentYear - 1, text: (currentYear - 1).toString() },
            { id: currentYear - 2, text: (currentYear - 2).toString() },
            { id: currentYear - 3, text: (currentYear - 3).toString() },
        ];
    }

    getMonths(): DropdownValue[] {
        const months = [
            { id: 1, text: 'January' },
            { id: 2, text: 'February' },
            { id: 3, text: 'March' },
            { id: 4, text: 'April' },
            { id: 5, text: 'May' },
            { id: 6, text: 'June' },
            { id: 7, text: 'July' },
            { id: 8, text: 'August' },
            { id: 9, text: 'September' },
            { id: 10, text: 'October' },
            { id: 11, text: 'November' },
            { id: 12, text: 'December' }
        ];
        return months;
    }

    adjustPagination(data: any, searchParams: any, count?: number) {
        const totalRecords = data?.totalRecords || 0;
        const totalPages = count ? Math.ceil((totalRecords - count) / searchParams.pageSize) : Math.ceil((totalRecords - 1) / searchParams.pageSize);
        if (searchParams.pageNumber > totalPages && searchParams.pageNumber > 0) {
            searchParams = {
                ...searchParams,
                pageNumber: searchParams.pageNumber - 1
            };
        }
        return searchParams;
    }

    convertStringToNumArray(str: string) {
        return str.split(',').map((x) => Number(x));
    }
}
