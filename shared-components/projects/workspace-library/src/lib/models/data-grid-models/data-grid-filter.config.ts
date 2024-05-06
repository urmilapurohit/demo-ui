import { DataGridSortOrder } from "./data-grid-sort-order.config";

export interface DataGridFilter<T> {
    pageNumber: number;
    pageSize: number;
    order: DataGridSortOrder<T>;
}
