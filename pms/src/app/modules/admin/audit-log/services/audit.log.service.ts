import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IAuditLogDelete, IAuditLogSearchParams } from '../models/audit.log';

@Injectable({
  providedIn: 'root'
})
export class AuditLogService {
  constructor(
    private httpService: HttpService
  ) { }

  getAuditLogs = (requestObject: IAuditLogSearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.AUDIT_LOG.GET_AUDIT_LOG, requestObject);
  };
  deleteAuditLogs = (requestObject:IAuditLogDelete) => {
    return this.httpService.post(API_ROUTES.ADMIN.AUDIT_LOG.DELETE_AUDIT_LOG_BY_IDS, requestObject);
  };
  getModuleList = () => {
    return this.httpService.get(API_ROUTES.ADMIN.AUDIT_LOG.GET_MODULES);
  };
  getPageList = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.AUDIT_LOG.GET_PAGES}/${id}`);
  };
  getAuditLogType = () => {
    return this.httpService.get(API_ROUTES.ADMIN.AUDIT_LOG.GET_TYPES);
  };
}
