import { FormGroup } from "@angular/forms";
import { DataGridColumn } from "./data-grid-column.config";
import { DataGridData } from "./data-grid-data.config";
import { DataGridFeatures } from "./data-grid-features.config";
import { DataGridSortOrder } from "./data-grid-sort-order.config";
import { DataGridFilter } from "./data-grid-filter.config";
import { DataGridActionButton } from "./data-grid-action-button.config";
import { DataGridNested } from "./data.grid.nested";

export interface DataGrid<T> {
    id: string;
    idFieldKey: keyof (T);
    columns: DataGridColumn<T>[];
    gridData: DataGridData<T>;
    features?: DataGridFeatures<T>;
    defaultSort?: DataGridSortOrder<T>;
    actionButtons?: DataGridActionButton<T>[];
    nestedGrid?: DataGridNested<T>;
    responseProperty?: string;
    pageIndex: number;
    defaultPageSize?: number;
    totalDataLength?: number;
    displayIndexNumber?: boolean;
    indexColumnHeaderName?: string;
    gridFilter?: DataGridFilter<T>;
    formGroup?: FormGroup;
    gridFormControlName?: string;
    isNoRecordFound?: boolean;
    isNoStripe?: boolean;
    validationFor?: string;
    isClientSidePagination?: boolean;
    paginationCallBack?: (event: any) => void;
    getSortOrderAndColumn?: (data: any) => void;
    customTableClass?: string;
}
