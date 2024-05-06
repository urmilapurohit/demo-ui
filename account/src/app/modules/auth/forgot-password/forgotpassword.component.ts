import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { InputType, ButtonType, TextField, Button, BaseResponseModel, IForgotPasswordData } from 'workspace-library';
import { ROUTES } from '../../../common/models/constant';
import { AuthService } from '../../../common/services/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgotpassword.component.html',
  styleUrl: './forgotpassword.component.css'
})

export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  userName!: TextField;
  submitBtnConfig!: Button;
  cancelBtnConfig!: Button;
  submitted: boolean = false;
  errorMessage: string = "";
  isLoading: boolean = false;

  constructor(private fb: FormBuilder, private router: Router, private service: AuthService) { }

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
  }

  private initializeForm(): void {
    this.forgotPasswordForm = this.fb?.group({
      username: new FormControl("", [Validators.required]),
    });
  }

  private setTextBoxConfig = (): void => {
    this.userName = {
      label: 'Username',
      formControlName: 'username',
      isLabelFloating: true,
      isRequired: true,
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.onSubmit(); }
    };
  };

  private setButtonConfig(): void {
    this.submitBtnConfig = {
      id: 'submitBtn',
      buttonText: "Submit",
      buttonType: ButtonType.default,
      className: 'primary-btn',
      callback: () => { this.onSubmit(); },
      disableCallBack: () => this.isLoading
    };

    this.cancelBtnConfig = {
      id: 'cancelBtn',
      buttonText: "Cancel",
      buttonType: ButtonType.default,
      className: 'primary-border-btn',
      callback: () => { this.router.navigate([ROUTES.AUTH.ABSOLUTE_LOGIN]); },
      disableCallBack: () => this.isLoading
    };
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  private onSubmit(): void {
    this.submitted = true;
    this.isLoading = true;
    if (this.forgotPasswordForm.valid) {
      const data: IForgotPasswordData = {
        username: this.f?.['username']?.value,
      };

      this.service.forgotPassword(data).subscribe({
        next: (res: BaseResponseModel<any>) => {
          if (res.isSuccess) {
            this.router.navigateByUrl(ROUTES.AUTH.ABSOLUTE_LOGIN, { state: { message: res.message } });
          }
          this.isLoading = false;
        },
        error: (err) => {
          this.errorMessage = err;
          this.isLoading = false;
        }
      });
    }
    else {
      this.isLoading = false;
    }
  }
}
