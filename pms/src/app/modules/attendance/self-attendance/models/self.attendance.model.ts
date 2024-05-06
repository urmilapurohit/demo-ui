export interface ISaveAttendanceModel {
    attendanceType: string
}

export interface IAttendanceSearchParams {
    month: number | null;
    year: number | null;
}

export interface IGetAttendanceModel {
    month: number
    year: number
}

export interface IAttendanceData {
    attendance: IAttendanceObject[];
    presentDay: number;
    absentDay: number;
    joiningDate: string;
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
