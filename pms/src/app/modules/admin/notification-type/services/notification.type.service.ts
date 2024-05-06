import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { INotificationType, INotificationTypeSearchParams } from '../models/notification.type';

@Injectable({
  providedIn: 'root'
})
export class NotificationTypeService {
  constructor(
    private httpService: HttpService
  ) { }

  getNotificationType = (requestObject: INotificationTypeSearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.NOTIFICATION_TYPE.GET_NOTIFICATION_TYPE, requestObject);
  };

  addNotificationType = (requestObject: INotificationType) => {
    return this.httpService.post(API_ROUTES.ADMIN.NOTIFICATION_TYPE.NOTIFICATION_TYPE_PREFIX, requestObject, true);
  };

  getNotificationTypeById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.NOTIFICATION_TYPE.NOTIFICATION_TYPE_PREFIX}/${id}`);
  };

  updateNotificationType = (id: number, requestObject: INotificationType) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.NOTIFICATION_TYPE.NOTIFICATION_TYPE_PREFIX}/${id}`, requestObject, true);
  };

  updateNotificationTypeStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.NOTIFICATION_TYPE.NOTIFICATION_TYPE_PREFIX}/${id}/${status}`, {}, true);
  };
}
