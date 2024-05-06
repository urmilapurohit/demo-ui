import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { IWidgetDetails } from '../models/widget-settings';

@Injectable({
  providedIn: 'root'
})
export class WidgetSettingsService {
  constructor(
    private httpService: HttpService
  ) { }

  getWidgetDetails = () => {
    return this.httpService.get(API_ROUTES.ADMIN.MEMBER_DASHBOARD_WIDGET.MEMBER_DASHBOARD_WIDGET_PREFIX);
  };

  updateWidgetDetails = (id: number, status: boolean, requestObject: IWidgetDetails) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.MEMBER_DASHBOARD_WIDGET.MEMBER_DASHBOARD_WIDGET_PREFIX}/${id}/${status}`, requestObject, true);
  };
}
