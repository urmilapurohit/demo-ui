import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { BaseResponseModel, Button, ButtonType, GlobalService, IChangePasswordModel, InputType, MustMatch, PasswordValidator, TextField } from 'workspace-library';
import { AuthService } from '@services/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-change-password-modal',
  templateUrl: './change-password-modal.component.html',
  styleUrl: './change-password-modal.component.css'
})
export class ChangePasswordModalComponent implements OnInit, OnDestroy {
  // #region class members
  oldPassword!: TextField;
  newPassword!: TextField;
  confirmPassword!: TextField;
  changePasswordButtonConfig!: Button;
  cancelButtonConfig!: Button;
  changePasswordFormGroup!: FormGroup;
  submitted: boolean = false;
  isLoading: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: AuthService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    public dialogRef: MatDialogRef<ChangePasswordModalComponent>
  ) { }
  // #endregion

  get f() {
    return this.changePasswordFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  private initializeForm(): void {
    this.changePasswordFormGroup = this.fb?.group(
      {
        oldPassword: ["", [Validators.required, Validators.maxLength(20), Validators.minLength(8)]],
        newPassword: ["", [Validators.required, PasswordValidator]],
        confirmPassword: ["", [Validators.required]]
      },
      {
        validator: MustMatch('newPassword', 'confirmPassword')
      }
    );
  }

  private setTextBoxConfig = (): void => {
    this.oldPassword = {
      label: 'Old password',
      formControlName: 'oldPassword',
      type: InputType.password,
      customClass: 'custom-form-control',
      isRequired: true,
      onEnterPress: () => { this.onSubmit(); }
    };

    this.newPassword = {
      label: 'New Password',
      formControlName: 'newPassword',
      type: InputType.password,
      isRequired: true,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.onSubmit(); }
    };

    this.confirmPassword = {
      label: 'Confirm Password',
      formControlName: 'confirmPassword',
      type: InputType.password,
      isRequired: true,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.onSubmit(); }
    };
  };

  private onSubmit(): void {
    this.submitted = true;
    this.isLoading = true;
    if (this.changePasswordFormGroup.valid) {
      const data: IChangePasswordModel = {
        oldPassword: this.f?.['oldPassword']?.value,
        newPassword: this.f?.['newPassword']?.value
      };
      this.service.changePassword(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<any>) => {
          if (res.isSuccess) {
            this.globalService.openSnackBar(res.message);
            this.isLoading = false;
            this.dialogRef.close();
          }
        },
        error: () => {
          this.isLoading = false;
        },
      });
    }
    else {
      this.isLoading = false;
    }
  }

  private setButtonConfig(): void {
    this.changePasswordButtonConfig = {
      id: 'changePassBtn',
      buttonText: "Change Password",
      buttonType: ButtonType.default,
      className: 'primary-btn',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.onSubmit(); },
      disableCallBack: () => this.isLoading,
    };

    this.cancelButtonConfig = {
      id: 'cancelBtn',
      buttonText: "Cancel",
      buttonType: ButtonType.default,
      className: 'primary-border-btn',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.dialogRef.close(); },
      disableCallBack: () => this.isLoading,
    };
  }
  // #endregion
}
