import { IPaginationParams, IProfilePhoto } from "@models/common.model";

export interface IProfileDetails {
    id:number;
    fullName: string,
    userName:string
    birthDate?: Date | string,
    gender: number,
    contactNo?: string,
    empNo: string,
    cardNo?: string,
    email: string,
    department: string,
    designation: string,
    reportingPerson?: string,
    projectManagerName?: string,
    experience:string,
    joinDate?: Date | string,
    office?:string,
    bloodGroup:string,
    emergencyContactNo?:string,
    diseasesInfo?:string,
    emailDomainId:number,
    profilePhoto: IProfilePhoto | null
}
export interface SystemElement {
    id:number
    itemType: string;
    itemModel: string;
    quantity: string;
    itemHome: string;
    serialNo: string;
    itemType2: string;
    itemModel2: string;
    quantity2: string;
    itemHome2: string;
    serialNo2: string;
    itemType3: string;
    itemModel3: string;
    quantity3: string;
    itemHome3: string;
    serialNo3: string;
}
export interface SystemElementList {
    records:SystemElement[],
    totalRecords: number;
}
export interface ISystemConfigurationSearchParams extends IPaginationParams {

}
export interface IUpdateMyProfile {
    email: string,
    emergencyContactNo:string,
    diseasesInfo:string,
    bloodGroup:string,
    contactNo: string,
}
export type ToggleVariables = 'toggleMail' | 'toggleNumber' | 'toggleAnyDiseases' | 'toggleEmergencyNo' | 'toggleBloodGroup';
