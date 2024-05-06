import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { INotification, INotificationSearchParams } from '../models/notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(
    private httpService: HttpService
  ) { }

  getNotificationByTypeId = (requestObject: INotificationSearchParams) => {
    return this.httpService.post(`${API_ROUTES.ADMIN.NOTIFICATION.GET_NOTIFICATION}`, requestObject);
  };

  addNotificationByType = (requestObject: INotification) => {
    return this.httpService.post(API_ROUTES.ADMIN.NOTIFICATION.NOTIFICATION_PREFIX, requestObject, true);
  };

  getNotificationById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.NOTIFICATION.NOTIFICATION_PREFIX}/${id}`);
  };

  getNotificationPriorityDropdown = () => {
    return this.httpService.get(API_ROUTES.ADMIN.NOTIFICATION.GET_NOTIFICATION_PRIORITY);
  };

  getNotificationTypeDropdown = () => {
    return this.httpService.get(API_ROUTES.ADMIN.NOTIFICATION.GET_NOTIFICATION_TYPE_DROPDOWN);
  };

  updateNotificationByType = (id: number, requestObject: INotification) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.NOTIFICATION.NOTIFICATION_PREFIX}/${id}`, requestObject, true);
  };

  updateNotificationStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.NOTIFICATION.NOTIFICATION_PREFIX}/${id}/${status}`, {}, true);
  };
}
