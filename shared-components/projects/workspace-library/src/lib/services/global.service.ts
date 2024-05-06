import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IDialogOptions } from '../models/common.model';
import { ConfirmationComponent } from '../components/confirmation/confirmation.component';
import { ToastMessageComponent } from '../components/components.index';

@Injectable({
    providedIn: 'root',
})
export class GlobalService {
    constructor(
        public dialog: MatDialog,
        private _snackBar: MatSnackBar,
    ) { }

    getDeepNestedCopy(data: any) {
        return JSON.parse(JSON.stringify(data));
    }

    openSnackBar(message?: string, panelClass?: string) {
        // eslint-disable-next-line no-underscore-dangle
        this._snackBar.openFromComponent(ToastMessageComponent, {
            data: {
                message,
                imgUrl: 'assets/images/close-icon-gray.svg'
            },
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'bottom',
            panelClass: panelClass || 'success-message',
        });
    }

    public getConfirmDialog(options: Partial<IDialogOptions>) {
        const dialogRef = this.dialog.open(ConfirmationComponent, {
            width: options.width ? options.width : '350px',
            autoFocus: true,
            data: {
                title: options.title ? options.title : '',
                bodyMessage: options.bodyMessage,
                showConfirmBtn: options.showConfirmBtn,
                confirmBtnName: options.confirmBtnName ?? 'Confrim',
                confirmCallBackAction: options.confirmCallBackAction ?? 'yes',
                showCancelBtn: options.showCancelBtn,
                cancelBtnName: options.cancelBtnName ?? 'Cancel',
                cancelCallBackAction: options.cancelCallBackAction ?? 'no'
            },
        });
        return dialogRef;
    }
}
