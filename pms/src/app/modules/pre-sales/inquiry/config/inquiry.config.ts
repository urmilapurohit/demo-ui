import { DataGridFieldDataType, DropdownValue } from "workspace-library";

export const InquiryTableColumns: any[] = [
    { id: 1, field: "projectName", title: "Project Name", customHeaderClassName: 'name-column' },
    { id: 2, field: "date", title: "Pre Sales Date", fieldDataType: DataGridFieldDataType.date, customHeaderClassName: 'pre-sale-date-column' },
    { id: 3, field: "countryName", title: "Country", customHeaderClassName: 'country-column', isHidden: true },
    { id: 4, field: "bdeName", title: "BDE", customHeaderClassName: 'country-column', isHidden: true },
    { id: 5, field: "projectTechnologies", title: "Project Technology", customHeaderClassName: 'country-column', isHidden: true },
    { id: 6, field: "rating", title: "Rating", customHeaderClassName: 'rating', isHidden: true },
    { id: 7, field: "sourceName", title: "Source", customHeaderClassName: 'source-column', isHidden: true },
    { id: 8, field: "baNames", title: "BA", customHeaderClassName: 'ba-column' },
    { id: 9, field: "hours", title: "Hours", customHeaderClassName: 'rating', isHidden: true },
    { id: 10, field: "estimatedGivenDate", title: "Estimation Given Date", customHeaderClassName: 'pre-sale-date-column', fieldDataType: DataGridFieldDataType.date, isHidden: true },
    { id: 11, field: "statusName", title: "Status", customHeaderClassName: 'source-column' },
    { id: 12, field: "typeName", title: "Inquiry Type", customHeaderClassName: 'source-column', isHidden: true },
    { id: 13, field: "clientBudget", title: "Client's Budget", customHeaderClassName: 'budget-column', isHidden: true },
    { id: 14, field: "otherMember", title: "Other Member", isHidden: true },
    { id: 15, field: "lastUpdatedOn", title: "Last Updated Date", customHeaderClassName: 'pre-sale-date-column', fieldDataType: DataGridFieldDataType.date, isHidden: true },
];

export const PersonalizedViewList = [
    { id: 3, text: "Country" },
    { id: 4, text: "BDE" },
    { id: 5, text: "Project Technology" },
    { id: 6, text: "Rating" },
    { id: 7, text: "Source" },
    { id: 9, text: "Hours" },
    { id: 10, text: "Estimation Given Date" },
    { id: 12, text: "Inquiry Type" },
    { id: 13, text: "Client's Budget" },
    { id: 14, text: "Other Member" },
    { id: 15, text: "Last Updated Date" }
];

export const RatingList: DropdownValue[] = [
    { id: 1, text: "1" },
    { id: 1.5, text: "1.5" },
    { id: 2, text: "2" },
    { id: 2.5, text: "2.5" },
    { id: 3, text: "3" },
    { id: 3.5, text: "3.5" },
    { id: 4, text: "4" },
    { id: 4.5, text: "4.5" },
    { id: 5, text: "5" }
];

export const PreSalesInquiryConstant = {
    New_Inquiry_Status: 3,
    Closed_Lost_Status: 6,
    Closed_Reason_Other: 497
};
