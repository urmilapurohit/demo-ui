import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';

@Injectable({
    providedIn: 'root'
})
export class MemberWiseService {
    constructor(
        private httpService: HttpService
    ) { }

    getModules = () => {
        return this.httpService.get(API_ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.GET_MODULES);
    };

    getPageRights = (moduleId: number, memberId: number) => {
        return this.httpService.get(`${API_ROUTES.ADMIN.AUTHORIZE.MEMBER_WISE.GET_PAGE_RIGHTS_BY_MODULE_MEMBER_ID}/${moduleId}/${memberId}`);
    };

    SavePageRights = (data: any) => {
        return this.httpService.post(API_ROUTES.ADMIN.AUTHORIZE.MEMBER_WISE.GET_PAGE_RIGHTS_BY_MODULE_MEMBER_ID, data, true);
    };

    GetPermissionList = () => {
        return this.httpService.get(API_ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.GET_ALL_PERMISSION);
    };
}
