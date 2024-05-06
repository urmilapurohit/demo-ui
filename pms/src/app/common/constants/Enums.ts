export enum DateFormats {
    YYYY_MM_DD = "YYYY-MM-DD",
    DD_MMM_YYYY = "DD-MMM-YYYY",
    DD_MMM_YYYY_HH_MM = 'DD/MMM/YYYY HH:mm',
    DD_MMM_YYYY_WITHOUT_HH_MM = 'DD/MMM/YYYY',
    MMM_YYYY = 'MMM-YYYY',
    YYYY = 'YYYY',
    YYYY_MM_DD_HH_MM_SS = 'yyyy-MM-DDTHH:mm:ss.SSS',
    MM_MMM = 'MM MMM',
    DD_MMM_YYYY_HH_MM_SS = 'DD-MMM-YYYY HH:mm:ss',
}

export enum PageAccessTypes {
    View = 1,
    Add = 2,
    Edit = 3,
    Delete = 4,
    Approve = 5,
    Export = 6
}

export enum Pages {
    Dashboard = 1,
    Admin = 2,
    Company = 3,
    Department = 4,
    Designation = 5,
    Holiday = 6,
    NewsEvents = 7,
    DocumentCategory = 8,
    Book = 9,
    Lookup = 10,
    Category = 11,
    CategoryDetail = 12,
    ApplicationConfiguration = 13,
    EmailTemplate = 14,
    ErrorLog = 15,
    Document = 16,
    BookCategory = 17,
    TechnicalSkill = 18,
    MemberDashboardWidgets = 19,
    ProjectGroup = 21,
    ProjectType = 22,
    ProjectStatus = 23,
    ProjectSDLCType = 24,
    NetworkItemType = 35,
    NetworkItemModel = 36,
    PreSalesInquiry = 39,
    PreSalesStatus = 41,
    PreSalesTechnology = 42,
    PreSalesMemberRole = 43,
    ProjectRole = 26,
    Authorization = 44,
    AuthorizationByDesignation = 45,
    AuthorizationByMember = 46,
    Vendor = 37,
    Attendance = 51,
    AttendanceSelf = 52,
    AttendanceTeam = 53,
    AttendanceManage = 54,
    AttendanceCorrect = 55,
    AdminAuditLog = 83,
    SystemStatus = 38,
    ProjectWorkFlowType = 49,
    ProjectWorkFlowStep = 50,
    HelpDeskCategory = 65,
    Regularization = 76,
    SelfRegularization = 77,
    TeamRegularization = 78,
    ManageRegularization = 79,
    TeamManage = 75,
    Documents = 84,
    ResourceManagementHierarchy = 74,
    ResourceManagementManage = 73,
    NotificationType = 81,
    NotificationTypeDetail = 82,
    TeamEfficiencyReport = 93,
    NetworkSystemType = 80
}

export enum UserThemes {
    LIGHT = 1,
    DARK = 2,
}

export enum AttendanceRegularizeStatus {
    PENDING = 1,
    APPROVED = 2,
    CORRECTED = 3,
    REJECTED = 4,
    CANCELED = 5,
}

export enum PendingAt {
    ALL = 1,
    ASSIGN_TO_MY_TEAM = 2,
    ASSIGN_TO_ME = 3
}

export enum AttendanceType {
    PRESENT = "P",
    ABSENT = "A",
    HALF_Leave = "H"
}

export enum AuditLogTypes {
    USER_LOGIN = 620,
    MODULE_ACCESS = 621,
    PAGE_ACCESS = 622
}
