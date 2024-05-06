import { ActivatedRouteSnapshot, CanActivateChildFn } from '@angular/router';
import { inject } from '@angular/core';
import { UiService } from '../services/ui.service';
import { ENVIRONMENT } from '../../../environments/environment';
import { AuthService } from '../services/auth.service';

export const AuthGuard: CanActivateChildFn = (route: ActivatedRouteSnapshot) => {
  const service = inject(AuthService);
  const dataService = inject(UiService);

  if (dataService.hasCheckedLogin) {
    return true;
  }
  else {
    const returnUrl = route.queryParams['returnUrl'] ? route.queryParams['returnUrl'].toString() : null;
    dataService.setAuthenticated();
    return service.validateUser().toPromise().then((response) => {
      if (response && response.isSuccess) {
        if (returnUrl) {
          window.location.href = `${ENVIRONMENT.PMS_CLIENT_URL}${returnUrl}`;
        }
        else {
          window.location.href = ENVIRONMENT.PMS_CLIENT_URL;
        }
        return false;
      }
      return true;
    }).catch(() => {
      return true;
    });
  }
};
