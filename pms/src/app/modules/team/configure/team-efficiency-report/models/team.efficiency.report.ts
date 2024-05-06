export interface ITeamEfficiencyReport {
    fullName: string;
    reportingMemberName: string;
    designation: string;
    isMainGroupInTer: boolean;
    isSubGroupInTer: boolean;
    canFillTer: boolean;
    reportingToMemberId: number;
}
export interface ITeamEfficiencyReportObject extends ITeamEfficiencyReport {
    memberId: number;
}
export interface ITeamEfficiencyReportList {
    records: ITeamEfficiencyReportObject[]
    totalRecords: number;
}
