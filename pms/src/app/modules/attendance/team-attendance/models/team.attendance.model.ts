export interface ISaveAttendanceModel {
    memberId: number,
    attendanceType: string;
}

export interface IAttendanceSearchParams {
    memberId: number | null;
    year: number | null;
    month: number | null;
    includeAllTeamMembers: boolean;
    todaysPendingAttendance: boolean;
}

export interface IGetAttendanceModel {
    memberId: number | null;
    year: number;
    month: number;
    includeAllTeamMembers: boolean;
    todaysPendingAttendance: boolean;

}

export interface IAttendanceResponse {
    reportingMembers: IReportingMember[] | null;
    teamAttendance: IAttendanceData[];
}

export interface IReportingMember {
    memberId: number;
    name: string;
}

export interface IAttendanceData {
    parentMemberName: string;
    teamMembers: ITeamMemberData[]
}

export interface ITeamMemberData {
    memberId: number;
    fullName: string;
    isParentMember: boolean;
    todaysPending: number | null;
    attendance: IAttendanceObject[],
    absentDay: number;
    joinDate: string;
    presentDay: number;
}

export interface IAttendanceObject {
    attendanceDate: string;
    attendanceType: string | null;
    isSubmitted: boolean;
    nameOfDay: string;
    isWeekOff: boolean;
    isPublicHoliday: boolean;
    isEditable: boolean;
}

export interface IGetRORequestObject {
    search: string;
}

export interface IParentHistory {
    order: number;
    name: string;
    memberId: number;
}

export interface IPendingAttendance {
    memberId: number;
    fullName: string;
    rOs: string;
}

export interface IGetPendingAttendanceRequest {
    attendanceDate: string;
    sortBy: string;
    sortDirection: string;
}
