import { IPaginationParams } from "workspace-library";

export interface SdlcElement {
  SDLCType: string;
  action: string;
}
export interface SdlcWorkFlowTypeElement {
    projectSdlcTypeId:number;
    abbreviation: string;
    name: string;
    isDefect: boolean;
    displayOrder: number;
    iconFileName:string;
}
  export interface ISdlcWorkFlowStepElement {
    color: string;
    name: string;
    isClosed: string;
    displayOrder: number;
}
export interface ISdlcWorkFlowStepObject extends ISdlcWorkFlowStepElement {
  id:number
}
export interface ISdlcWorkFlowStepList {
  records: ISdlcWorkFlowStepObject[];
  totalRecords: number;
}
export interface ISdlcWorkFlowTypeObject extends SdlcWorkFlowTypeElement {
  id:number,
}
export interface ISdlcWorkFlowTypeList {
  records: ISdlcWorkFlowTypeObject[];
  totalRecords: number;
}
export interface ColorSelect {
    id: string;
    text: string;
}
export interface ISdlcTypeSearchParams extends IPaginationParams {
  isActive: boolean;
}
export interface ISdlcType {
  name: string,
  isActive: boolean,
  isDefault: boolean
}
export interface IAddSdlcType {
  name: string,
  isActive:boolean
}
export interface ISdlcTypeObject extends ISdlcType {
  id: number;
}
export interface ISdlcTypeList {
  records: ISdlcTypeObject[]
  totalRecords: number;
}
export interface IWorkFlowStepSearchParams extends IPaginationParams {
  search: string;
}
export interface IWorkFlowTypeSearchParams extends IPaginationParams {
  search: string;
}
export interface IAddSdlcWorkFlowStep {
  projectSdlcTypeId: number,
  name: string,
  color: string,
  isClosed: boolean
}
export interface IAddSdlcWorkFlowType {
  projectSdlcTypeId: number,
  name: string,
  isDefect: boolean,
  abbreviation: string,
  iconFileName: string
}

export interface IFileListType {
  id: number;
  name: string;
}
