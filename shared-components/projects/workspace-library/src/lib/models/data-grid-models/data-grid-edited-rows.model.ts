import { DataGridFullRowData } from "./data-grid-data.config";

export interface DataGridEditedRows<T> {
    /**
     * list of object containing modified data
     */
    formData: singleRowData<T>[];

    /**
     * grid current state info like pagination, sort, etc
     */
    paginationInfo?: DataGridFullRowData<T>;
}

// eslint-disable-next-line @typescript-eslint/naming-convention
export interface singleRowData<T> {
    /**
     * object containing modified data
     */
    formData: any;

    /**
     * object containing original data before modification
     */
    originalData: T;
}
