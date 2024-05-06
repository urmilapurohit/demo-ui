import { DropdownValue } from "workspace-library";
import { IPaginationParams } from "../../../../common/models/common.model";

export interface ITeamManage {
    fullName?: string;
    email?: string;
    contactNo?: string;
    birthDate?: string;
    designation?: string;
    currentProjects?: string;
    technicalSkills?: string;
    technicalSkillIds: number[];
    totalExp?: string;
    assignedHours?: string;
    reportingToMemberId?: number;
    ReportingToMember?: string;
}

export interface ITeamManageObject extends ITeamManage {
    id: number;
    customToolTip: string;
    reportingMembers: DropdownValue[];
}

export interface HolidayType {
    date: string;
    holidayType: string;
    id: number;
    isPublicHoliday: boolean;
    remark: string;
}

export interface ITeamManageList {
    records: ITeamManageObject[]
    totalRecords: number;
}

export interface ITeamManageSearchParams extends IPaginationParams {
    search?: string;
    designationId?: number;
    leadId?: number;
    technicalSkillIds?: number[];
}

export interface ITeamManageHierarchy {
    fullName?: string;
    profilePhoto?: any;
    designation?: string;
    totalExp?: string;
    isParent: boolean;
    technicalSkills?: string;
    immediateChildrenCount: number;
    totalChildrenCount: number;
    reportingToMemberId?: number;
}

export interface ITeamManageHierarchyObject extends ITeamManageHierarchy {
    id: number;
}
