import { Injectable } from '@angular/core';
import { HttpService } from '@services/http.service';
import { API_ROUTES } from '@constants/apiroutes';
import { IAddSdlcType, IAddSdlcWorkFlowStep, ISdlcTypeSearchParams, IWorkFlowStepSearchParams, IWorkFlowTypeSearchParams } from '../models/sdlc.type';

@Injectable({
  providedIn: 'root'
})
export class SDLCTypeService {
  constructor(
    private httpService: HttpService
  ) { }

  getSdlcType = (requestObject: ISdlcTypeSearchParams) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.GET_SDLC_TYPE, requestObject);
  };
  addSdlcType = (requestObject: IAddSdlcType) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.SDLC_TYPE_PREFIX, requestObject, true);
  };
  getSdlcById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.SDLC_TYPE_PREFIX}/${id}`, true);
  };
  updateSdlcType = (id: number, requestObject: IAddSdlcType) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.SDLC_TYPE_PREFIX}/${id}`, requestObject, true);
  };
  updateStatus = (id: number, status: boolean) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.SDLC_TYPE_PREFIX}/${id}/${status}`, {});
  };

  // Service For SDLC Type Work Step Type
  getWorkFlowStepBySdlcTypeId = (id: number, requestObject:IWorkFlowStepSearchParams) => {
    return this.httpService.post(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.GET_WORK_FLOW_STEP}/${id}`, requestObject, true);
  };
  deleteSdlcWorkFlowStep = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.WORK_FLOW_STEP_PREFIX}/${id}`);
  };
  addSdlcWorkFlowStep = (requestObject: IAddSdlcWorkFlowStep) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.WORK_FLOW_STEP_PREFIX, requestObject, true);
  };
  getSdlcWorkFlowStepById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.WORK_FLOW_STEP_PREFIX}/${id}`, true);
  };
  updateSdlcWorkFlowStep = (id: number, requestObject: IAddSdlcWorkFlowStep) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.WORK_FLOW_STEP_PREFIX}/${id}`, requestObject, true);
  };

  // Service For SDLC Type Work Flow Type
  getWorkFlowTypeBySdlcTypeId = (id: number, requestObject:IWorkFlowTypeSearchParams) => {
    return this.httpService.post(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.GET_WORK_FLOW_TYPE}/${id}`, requestObject, true);
  };
  deleteSdlcWorkFlowType = (id: number) => {
    return this.httpService.delete(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.WORK_FLOW_TYPE_PREFIX}/${id}`);
  };
  addSdlcWorkFlowType = (requestObject: FormData) => {
    return this.httpService.post(API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.WORK_FLOW_TYPE_PREFIX, requestObject, true);
  };
  getSdlcWorkFlowTypeById = (id: number) => {
    return this.httpService.get(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.WORK_FLOW_TYPE_PREFIX}/${id}`, true);
  };
  updateSdlcWorkFlowType = (id: number, requestObject: FormData) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.WORK_FLOW_TYPE_PREFIX}/${id}`, requestObject, true);
  };
  getIconPreview = (id: number, responseType: string) => {
    return this.httpService.get(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.DOCUMENT_PREVIEW}${id}`, false, undefined, responseType);
  };
  updateSdlcWorkFlowTypeDisplayOrder = (id: number, moveUp :boolean) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.WORK_FLOW_TYPE_PREFIX}/${id}/${moveUp}`, {});
  };
  updateSdlcWorkFlowStepDisplayOrder = (id: number, moveUp :boolean) => {
    return this.httpService.put(`${API_ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC_TYPE.WORK_FLOW_STEP_PREFIX}/${id}/${moveUp}`, {});
  };
}
