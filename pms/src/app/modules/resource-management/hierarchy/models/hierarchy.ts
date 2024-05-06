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
