import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BaseResponseModel, Button, ButtonType, ILoginData, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { ENVIRONMENT } from '../../../../environments/environment';
import { AuthService } from '../../../common/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  hide = true;
  userName!: TextField;
  password!: TextField;
  loginForm!: FormGroup;
  logInBtnConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  alertMessage: string = "";
  isFromForgotPassword: boolean = false;
  returnUrl: string | null = null;

  constructor(private fb: FormBuilder, private service: AuthService, private route: ActivatedRoute) {
    this.route.queryParamMap.subscribe((p: ParamMap) => {
      this.returnUrl = p.get('returnUrl') ?? null;
    });
    const alertMessage = window.history.state?.message;
    if (alertMessage) {
      this.isFromForgotPassword = true;
      this.alertMessage = alertMessage;
    }
    window.history.replaceState({}, document.title, window.location.href);
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
  }

  get f() {
    return this.loginForm.controls;
  }

  private initializeForm(): void {
    this.loginForm = this.fb?.group({
      username: ["", [Validators.required]],
      password: ["", [Validators.required]],
      rememberMe: [false]
    });
  }

  private setTextBoxConfig = (): void => {
    this.userName = {
      label: 'Username',
      formControlName: 'username',
      type: InputType.text,
      customClass: 'custom-form-control',
      maxLength: 50,
      isRequired: true,
      onEnterPress: () => { this.onSubmit(); }
    };

    this.password = {
      label: 'Password',
      formControlName: 'password',
      type: InputType.password,
      isRequired: true,
      maxLength: 20,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.onSubmit(); }
    };
  };

  private setButtonConfig(): void {
    this.logInBtnConfig = {
      id: 'loginBtn',
      buttonText: "Login",
      buttonType: ButtonType.default,
      className: 'primary-btn',
      customWidthClass: 'customFullWidthClass',
      callback: () => { this.onSubmit(); },
      disableCallBack: () => this.loading
    };
  }

  private onSubmit(): void {
    this.alertMessage = "";
    this.isFromForgotPassword = false;
    this.submitted = true;
    this.loading = true;
    if (this.loginForm.valid) {
      const data: ILoginData = {
        username: this.f?.['username']?.value,
        password: this.f?.['password']?.value
      };

      this.service.login(data).subscribe({
        next: (res: BaseResponseModel<any>) => {
          if (res.isSuccess) {
            if (this.returnUrl) {
              window.location.href = ENVIRONMENT.PMS_CLIENT_URL + this.returnUrl;
            }
            else {
              window.location.href = ENVIRONMENT.PMS_CLIENT_URL;
            }
          }
          this.loading = false;
        },
        error: (err) => {
          this.alertMessage = err;
          this.loading = false;
        }
      });
    }
    else {
      this.loading = false;
    }
  }
}
