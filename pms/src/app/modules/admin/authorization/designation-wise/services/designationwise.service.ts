import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';

@Injectable({
    providedIn: 'root'
})
export class DesignationWiseService {
    constructor(
        private httpService: HttpService
    ) { }

    getDesignations = () => {
        return this.httpService.get(API_ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.GET_DESIGNATIONS);
    };

    getModules = () => {
        return this.httpService.get(API_ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.GET_MODULES);
    };

    getPageRights = (moduleId: number, designationId: number) => {
        return this.httpService.get(`${API_ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.GET_PAGE_RIGHTS_BY_MODULE_DESIGNATION_ID}/${moduleId}/${designationId}`);
    };

    SavePageRights = (data: any) => {
        return this.httpService.post(API_ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.GET_PAGE_RIGHTS_BY_MODULE_DESIGNATION_ID, data, true);
    };

    GetPermissionList = () => {
        return this.httpService.get(API_ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.GET_ALL_PERMISSION);
    };
}
