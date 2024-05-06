import { Injectable } from '@angular/core';
import { AUTH_ROUTES, IForgotPasswordData, ILoginData } from 'workspace-library';
import { HttpService } from './http.service';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    constructor(
        private httpService: HttpService
    ) { }

    login = (model: ILoginData) => {
        return this.httpService.post(AUTH_ROUTES.LOGIN, model);
    };

    forgotPassword = (model: IForgotPasswordData) => {
        return this.httpService.post(AUTH_ROUTES.FORGOT_PASSWORD, model);
    };

    validateUser = () => {
        return this.httpService.get(AUTH_ROUTES.VALIDATE);
    };
}
