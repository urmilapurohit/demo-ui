import { DataGridFullRowData } from "./data-grid-data.config";
import { DataGridColumn } from "./data-grid-column.config";
import { Button } from "../button";

export interface DataGridFeatures<T> {
    hidePagination?: boolean;
    exportEnabled?: boolean;
    selectConfig?: DataGridSelectConfig<T>;
    editConfig?: DataGridEditFeatureConfig<T>;
    groupColumn?: keyof(T);
    doubleClickCallback?: (data: T, column: DataGridColumn<T>) => void;
}

export interface DataGridToolbar {
    buttons: Button[];
    isSearchEnabled?: boolean;
}

export interface DataGridEditFeatureConfig<T> {
    isEditable: boolean;
    setAllRowsInEditMode?: boolean;
    singleRowSaveCallback?: (formData: any, data: DataGridFullRowData<T>) => void;
}

export interface DataGridSelectConfig<T> {
    enableSelectColumn?: boolean;
    onlyAllowSingleSelect?: boolean;
    disableCallback?: (data: T) => boolean;
    preSelectedCallback?: (data: T) => boolean;
    getSelectedIdsCallback?: (id: number[]) => void;
    getSelectedDataCallback?: (data: T[], rowData: DataGridFullRowData<T>) => void;
}
