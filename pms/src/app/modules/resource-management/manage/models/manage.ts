import { MatTableDataSource } from "@angular/material/table";
import { DataGrid } from "workspace-library";
import { IPaginationParams } from "@models/common.model";

export interface User {
  fullName: string;
  designation: string;
  department: string;
  totalExp: string;
  reportingToMemberId: number;
  reportingToMember: string;
  workStatus: string;
  totalAllottedHours: string;
  releaseDate: string;
  noOfProjects: number;
  technicalSkills: string;
}

export interface ProjectDetail {
  projectName: string;
  pmLeadName: string;
  startDate: string;
  endDate: string;
  allottedHours: string;
  workStatus: string;
  billable: string;
}

export interface UserDataSource {
  name: string;
  email: string;
  phone: string;
  addresses?: MatTableDataSource<ProjectDetail>;
}
export interface IResourceSearchParams extends IPaginationParams {
  search?: string;
  workStatus?: string;
  projectNatureId?: number;
  allocationTypeId?: number;
  memberStatusId?: number;
  designationIds?: number[];
  departmentIds?: number[];
  startDate?: Date | string | null;
  endDate?: Date | string | null;
  nonBillableOnly?: boolean,
  excludeResignedMembers?: boolean,
  pmLeadId?: number;
  technicalSkillIds?: number[]
}

export interface IUserObject extends User {
  id: number;
  nestedGridConfig?: DataGrid<ProjectDetail>;
  isExpanded: boolean;
}
export interface IPorjectDetailsSearchParam {
  memberId: number,
  projectNatureId?: number,
  startDate?: Date | string | null;
  endDate?: Date | string | null;
}
export interface IResourceManageList {
  records: IUserObject[]
  totalRecords: number;
}
export interface ImmediateSeniorHistory {
  fullName: string,
  startDate: Date | string,
  endDate: Date | string,
  days: number
}

export interface ImmediateSeniorHistoryList {
  data: ImmediateSeniorHistory[],
}
export interface ImmediateSeniorHistorySearchParam extends IPaginationParams {
}
