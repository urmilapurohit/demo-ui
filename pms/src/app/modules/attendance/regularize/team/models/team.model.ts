import { IPaginationParams } from "@models/common.model";

export interface ITeam {
    name?: string;
    attendanceDate: Date | string;
    submittedAttendanceType: string;
    correctedAttendanceType: string;
    attendanceRegularizationStatus: string;
}

export interface ITeamObject extends ITeam {
    id: number;
}

export interface ITeamList {
    records: ITeamObject[]
    totalRecords: number;
}

export interface ITeamSearchParams extends IPaginationParams {
    search: string;
    status: number;
    startDate?: Date | string;
    endDate?: Date | string;
    viewRequestType: number;
}

export interface ITeamHistory {
    name: string;
    status: string;
    comments?: string | "";
}

export interface ITeamHistoryObject extends ITeamHistory {
    id: number;
}

export interface ITeamHistoryList {
    records: ITeamHistoryObject[]
    totalRecords: number;
}

export interface ITeamHistorySearchParams extends IPaginationParams {
    search: string;
}

export interface ITeamUpdate {
    status: number,
    comments: string
}

export interface ITeamDetails {
    id: string;
    attendanceDate: Date | string;
    submittedAttendanceType: string;
    correctedAttendanceType: string;
    attendanceRegularizationStatusId: number;
    comments: string,
}
