import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { IMemberRole, IMemberRoleSearchParams } from '../models/member.role.model';

@Injectable({
    providedIn: 'root'
})
export class MemberRoleService {
    constructor(private httpService: HttpService) { }

    getMemberRoles = (requestObject: IMemberRoleSearchParams) => {
        return this.httpService.post(API_ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.GET_MEMBER_ROLE, requestObject);
    };

    getMemberRoleById = (id: number) => {
        return this.httpService.get(`${API_ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.GET_MEMBER_ROLE_ID}${id}`);
    };

    addMemberRole = (requestObject: IMemberRole) => {
        return this.httpService.post(API_ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.ADD_MEMBER_ROLE, requestObject, true);
    };

    updateMemberRole = (id: number, requestObject: IMemberRole) => {
        return this.httpService.put(`${API_ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.GET_MEMBER_ROLE_ID}${id}`, requestObject, true);
    };

    deleteMemberRole = (id: number) => {
        return this.httpService.delete(`${API_ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.GET_MEMBER_ROLE_ID}${id}`, true);
    };

    updateStatus = (id: number, status: boolean) => {
        return this.httpService.put(`${API_ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.GET_MEMBER_ROLE_ID}/${id}/${status}`, {}, true);
    };

    getDesignations = () => {
        return this.httpService.get(API_ROUTES.ADMIN.AUTHORIZE.DESIGNATION_WISE.GET_DESIGNATIONS);
    };
}
