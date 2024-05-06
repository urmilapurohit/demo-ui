import { Injectable } from '@angular/core';
import { API_ROUTES } from '@constants/apiroutes';
import { HttpService } from '@services/http.service';
import { IApplicationConfiguration, IApplicationConfigurationSearchParams } from '../models/application.configuration';

@Injectable({
  providedIn: 'root'
})

export class ApplicationConfigurationService {
  constructor(
    private httpService: HttpService
  ) { }

  getApplicationConfiguration = (requestObject: IApplicationConfigurationSearchParams) => {
    return this.httpService.post(API_ROUTES.ADMIN.APPLICATION_CONFIGURATION.GET_APPLICATION_CONFIGURATION, requestObject);
  };

  getApplicationConfigurationById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.APPLICATION_CONFIGURATION.GET_APPLICATION_CONFIGURATION_BY_ID}${id}`);
  };

  updateApplicationConfiguration = (id: number, requestObject: IApplicationConfiguration) => {
    return this.httpService.put(`${API_ROUTES.ADMIN.APPLICATION_CONFIGURATION.UPDATE_APPLICATION_CONFIGURATION}${id}`, requestObject, true);
  };

  resetApplicationConfigurationCache = () => {
    return this.httpService.get(API_ROUTES.ADMIN.APPLICATION_CONFIGURATION.RESET_APPLICATION_CONFIGURATION_CACHE);
  };
}
