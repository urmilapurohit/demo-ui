import { Observable } from "rxjs";
import { DataGridFilter } from "./data-grid-filter.config";

export interface DataGridData<T> {
    data?: T[];
    summaryData?: any;
    dataSource?: (filterObject: DataGridFilter<T>) => Observable<T>;
}

export interface DataGridFullRowData<T> {
    rowData: T | null;
    currentRowIndex: number;
    currentPageNumber: number;
    currentPageSize: number;
}
