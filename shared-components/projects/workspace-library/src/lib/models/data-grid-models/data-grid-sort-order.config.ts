import { SortDirection } from "@angular/material/sort";

export interface DataGridSortOrder<T> {
    sortColumn: keyof (T);
    dir: SortDirection;
}
