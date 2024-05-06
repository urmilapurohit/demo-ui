import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { IUpdateMyProfile } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(
    private httpService: HttpService
  ) { }
  getSystemConfigurationById = () => {
    return this.httpService.get(``);
  };
  getMyProfile = () => {
    return this.httpService.get(API_ROUTES.ACCOUNT.MY_PROFILE.GET_PROFILE, true);
  };
  updateMyProfile = (model: IUpdateMyProfile) => {
    return this.httpService.post(API_ROUTES.ACCOUNT.MY_PROFILE.UPDATE_PROFILE, model, true);
  };
  getEmailDomain = () => {
    return this.httpService.get(API_ROUTES.ACCOUNT.MY_PROFILE.GET_EMAIL_DOMAIN);
  };
}
