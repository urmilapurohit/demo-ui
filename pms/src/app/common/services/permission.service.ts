import { Injectable } from '@angular/core';
import { PageAccessTypes } from '@constants/Enums';
import { IPageRights, IRoutePermission, PageAccessPermission } from '@models/common.model';
import { UIService } from './ui.service';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  constructor(private service: UIService) { }

  hasPermission(pagePermissionData: IRoutePermission): boolean {
    const permissionData = this.service.getPagePermission();
    if (!pagePermissionData.pageId && !permissionData) {
      return false;
    }

    const pageRights = permissionData?.pageAccess.pageRights.filter((x) => x.modulePageId === pagePermissionData.pageId);
    if (pageRights && pageRights?.length > 0) {
      return this.checkPermission(pagePermissionData.permission, pageRights);
    }

    return false;
  }

  checkPermission(routePermission: number[], pageRights: IPageRights[]): boolean {
    const pageAccessTypeIds = new Set(pageRights.map((x) => x.pageAccessTypeId));
    return routePermission.every((accessTypeId) => pageAccessTypeIds.has(accessTypeId));
  }

  checkAccessPermission(pageId: number, permissionType: number) {
    const permissionData = this.service.getPagePermission();
    const pageRights = permissionData?.pageAccess.pageRights.filter((x) => x.modulePageId === pageId && x.pageAccessTypeId === permissionType);
    if (pageRights && pageRights.length > 0) {
      return true;
    }
    return false;
  }

  checkAllPermission(pageId: number) {
    const permission: PageAccessPermission = {
      isViewPermission: false,
      isAddPermission: false,
      isEditPermission: false,
      isDeletePermission: false,
      isExportPermission: false
    };
    const permissionData = this.service.getPagePermission();
    const pageRights = permissionData?.pageAccess.pageRights.filter((x) => x.modulePageId === pageId);
    if (pageRights) {
      permission.isViewPermission = pageRights.findIndex((x) => x.pageAccessTypeId === PageAccessTypes.View) > -1;
      permission.isAddPermission = pageRights.findIndex((x) => x.pageAccessTypeId === PageAccessTypes.Add) > -1;
      permission.isEditPermission = pageRights.findIndex((x) => x.pageAccessTypeId === PageAccessTypes.Edit) > -1;
      permission.isDeletePermission = pageRights.findIndex((x) => x.pageAccessTypeId === PageAccessTypes.Delete) > -1;
      permission.isExportPermission = pageRights.findIndex((x) => x.pageAccessTypeId === PageAccessTypes.Export) > -1;
    }

    return permission;
  }
}
