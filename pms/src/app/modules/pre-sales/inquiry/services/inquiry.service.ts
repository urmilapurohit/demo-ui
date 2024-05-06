import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { IInquirySearchParams, ISearchCriteriaContent, IUpdateInquiry } from '../models/inquiry';

@Injectable({
  providedIn: 'root'
})
export class InquiryService {
  constructor(
    private httpService: HttpService
  ) { }

  getInquiry = (requestObject: IInquirySearchParams) => {
    return this.httpService.post(API_ROUTES.PRE_SALES.INQUIRY.GET_INQUIRY, requestObject);
  };

  getMemberRoleBdeDropDown = () => {
    return this.httpService.get(`${API_ROUTES.PRE_SALES.INQUIRY.GET_MEMBER_BDE}`);
  };

  getMemberRoleBaDropDown = () => {
    return this.httpService.get(`${API_ROUTES.PRE_SALES.INQUIRY.GET_MEMBER_BA}`);
  };

  getStatusDropDown = () => {
    return this.httpService.get(`${API_ROUTES.PRE_SALES.INQUIRY.GET_STATUS}`);
  };

  getProjectTechnologyDropDown = () => {
    return this.httpService.get(`${API_ROUTES.PRE_SALES.INQUIRY.GET_TECHNOLOGY}`);
  };

  getLookUpCategoryByID = (id: number) => {
    return this.httpService.get(`${API_ROUTES.ADMIN.OPEN.GET_LOOKUP_CATEGORY_DETAIL_BY_ID}${id}`);
  };

  getInquiryById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PRE_SALES.INQUIRY.INQUIRY_PREFIX}${id}`);
  };

  addInquiry = (requestObject: IUpdateInquiry) => {
    return this.httpService.post(API_ROUTES.PRE_SALES.INQUIRY.ADD_INQUIRY, requestObject);
  };

  updateInquiry = (id: number, requestObject: IUpdateInquiry) => {
    return this.httpService.put(`${API_ROUTES.PRE_SALES.INQUIRY.INQUIRY_PREFIX}${id}`, requestObject);
  };

  getPersonalizedView = () => {
    return this.httpService.get(API_ROUTES.PRE_SALES.INQUIRY.PERSONALIZED_VIEW_PREFIX);
  };

  addUpdatePersonalizedView = (requestObject: any) => {
    return this.httpService.put(API_ROUTES.PRE_SALES.INQUIRY.PERSONALIZED_VIEW_PREFIX, requestObject);
  };

  getSavedSearch = () => {
    return this.httpService.post(API_ROUTES.PRE_SALES.INQUIRY.GET_SAVED_SEARCH, undefined);
  };

  getSavedSearchById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PRE_SALES.INQUIRY.SAVED_SEARCH_PREFIX}${id}`);
  };

  addSavedSearch = (requestObject: ISearchCriteriaContent) => {
    return this.httpService.post(API_ROUTES.PRE_SALES.INQUIRY.ADD_SAVED_SEARCH, requestObject);
  };

  updateSavedSearch = (id: number, requestObject: ISearchCriteriaContent) => {
    return this.httpService.put(`${API_ROUTES.PRE_SALES.INQUIRY.SAVED_SEARCH_PREFIX}${id}`, requestObject);
  };

  deleteSavedSearchStatus = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.PRE_SALES.INQUIRY.SAVED_SEARCH_PREFIX}${id}`);
  };

  getCurrentMemberRole = () => {
    return this.httpService.post(`${API_ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.GET_CURRENT_MEMBER_ROLE}`, undefined);
  };

  getOneDrivePath = (id: number) => {
    return this.httpService.post(`${API_ROUTES.PRE_SALES.CONFIGURATION.MEMBER_ROLE.GET_ONE_DRIVE_PATH}${id}`, undefined);
  };
}
