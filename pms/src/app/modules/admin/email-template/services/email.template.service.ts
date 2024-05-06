import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IEmailTemplate, IEmailTemplateSearchParams } from '../models/email.template';

@Injectable({
    providedIn: 'root'
})
export class EmailTemplateService {
    constructor(private httpService: HttpService) { }

    getEmailTemplates = (requestObject: IEmailTemplateSearchParams) => {
        return this.httpService.post(API_ROUTES.ADMIN.EMAIL_TEMPLATE.GET_EMAIL_TEMPLATE, requestObject);
    };

    deleteEmailTemplate = (id: number) => {
        return this.httpService.delete(`${API_ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_PREFIX}${id}`, true);
    };

    getEmailTemplateById = (id: number) => {
        return this.httpService.get(`${API_ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_PREFIX}${id}`);
    };

    updateEmailTemplate = (id: number, requestObject: IEmailTemplate) => {
        return this.httpService.put(`${API_ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_PREFIX}${id}`, requestObject, true);
    };

    updateStatus = (id: number, status: boolean) => {
        return this.httpService.put(`${API_ROUTES.ADMIN.EMAIL_TEMPLATE.EMAIL_TEMPLATE_PREFIX}${id}/${status}`, {}, true);
    };
}
