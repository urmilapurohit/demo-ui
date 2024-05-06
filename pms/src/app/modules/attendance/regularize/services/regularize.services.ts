import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { COMMON_ICON, GLOBAL_CONSTANTS } from '@constants/constant';
import { Button, ButtonType, DataGridFullRowData } from 'workspace-library';

@Injectable({
    providedIn: 'root',
})
export class RegularizeService {
    constructor(
        public dialog: MatDialog,
    ) { }

    getSubmitButtonConfig(callback: any, disableCallBack?: () => boolean): Button {
        return {
            id: 'applyButton',
            buttonText: GLOBAL_CONSTANTS.SUBMIT,
            buttonType: ButtonType.default,
            className: 'primary-btn',
            callback: () => { callback(); },
            disableCallBack
        };
    }
    getViewActionButtonConfig(callback: any, visibleCallbackValue?: (data: any) => boolean) {
        return {
            btnImageSrc: COMMON_ICON.VIEW_ICON,
            btnType: ButtonType.img,
            className: 'action-item table-icon-btn',
            tooltip: GLOBAL_CONSTANTS.VIEW_ICON_TOOLTIP,
            callback: (data: DataGridFullRowData<any>) => {
                callback(data);
            },
            visibleCallback: visibleCallbackValue
        };
    }
}
