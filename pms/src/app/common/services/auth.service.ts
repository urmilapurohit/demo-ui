import { Injectable } from '@angular/core';
import { AUTH_ROUTES, IChangePasswordModel, IForgotPasswordData, ILoginData } from 'workspace-library';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private httpService: HttpService
    ) { }

    login = (model: ILoginData) => {
        return this.httpService.post(AUTH_ROUTES.LOGIN, model, false, undefined, "", true);
    };

    refreshToken = () => {
        return this.httpService.get(AUTH_ROUTES.REFRESH_TOKEN, false, undefined, "", true);
    };

    forgotPassword = (model: IForgotPasswordData) => {
        return this.httpService.post(AUTH_ROUTES.FORGOT_PASSWORD, model, false, undefined, "", true);
    };

    validateUser = () => {
        return this.httpService.get(AUTH_ROUTES.VALIDATE, false, undefined, "", true);
    };

    changePassword = (model: IChangePasswordModel) => {
        return this.httpService.post(AUTH_ROUTES.CHANGE_PASSWORD, model, false, undefined, "", true);
    };

    logout = () => {
        return this.httpService.get(AUTH_ROUTES.LOGOUT, false, undefined, "", true);
    };
}
