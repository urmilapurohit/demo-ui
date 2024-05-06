import { ActivatedRouteSnapshot, CanActivateChildFn, RouterStateSnapshot } from '@angular/router';
import { inject } from '@angular/core';
import { UIService } from '../services/ui.service';
import { ENVIRONMENT } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
    const service = inject(AuthService);
    const dataService = inject(UIService);
    if (dataService.hasCheckedLogin) {
        return true;
    }
    else {
        return service.validateUser().toPromise().then((response) => {
            if (response && response?.isSuccess && response?.data) {
                dataService.setAuthenticated();
                dataService.setPagePermission(response.data);
                return true;
            }
            else {
                if (state.url === '/') {
                    window.location.href = ENVIRONMENT.ACCOUNT_CLIENT_URL;
                }
                else {
                    window.location.href = `${ENVIRONMENT.ACCOUNT_LOGIN_CLIENT_URL}?returnUrl=${state.url && state.url.length > 0 && state.url[0] === '/' ? state.url.substring(1) : ''}`;
                }
                return false;
            }
        }).catch(() => {
            if (state.url === '/') {
                window.location.href = ENVIRONMENT.ACCOUNT_CLIENT_URL;
            }
            else {
                window.location.href = `${ENVIRONMENT.ACCOUNT_LOGIN_CLIENT_URL}?returnUrl=${state.url && state.url.length > 0 && state.url[0] === '/' ? state.url.substring(1) : ''}`;
            }
            return false;
        });
    }
};
