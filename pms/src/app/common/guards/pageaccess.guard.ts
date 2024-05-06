import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { PermissionService } from '../services/permission.service';
import { IRoutePermission } from '../models/common.model';
import { COMMON_ROUTES } from '../constants/constant';

export const pageaccessGuard: CanActivateChildFn = (route) => {
  const router = inject(Router);
  const permissionService = inject(PermissionService);

  const requiredPermission = route.data as IRoutePermission;

  if (requiredPermission && requiredPermission.pageId && requiredPermission.permission && !permissionService.hasPermission(requiredPermission as IRoutePermission)) {
    router.navigate([COMMON_ROUTES.REDIRECT_TO_UNAUTHORIZED]);
    return false;
  }

  return true;
};
