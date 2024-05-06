import { FormGroup } from "@angular/forms";
import { DataGridColumn } from "./data-grid-column.config";

export interface DataGridEditErrorDialogData<T> {
    formGroup: FormGroup;
    columns: DataGridColumn<T>[];
}
