export interface Hierarchy {
    parentData?: IHierarchy;
    childData?: IHierarchy[];
    nextImgUrl?: string;
    previousImgUrl?: string;
    previewImgUrl?: string;
    onExpandHierarchy?(data: number): void;
}

export interface IHierarchy {
    id: number;
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
