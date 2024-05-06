import { DataGridActionButton } from "./data-grid-action-button.config";

export interface DataGridNested<T> {
    nestedActionButtons?: DataGridActionButton<T>[];
    isContainNestedTable?: boolean;
    expandField?: string;
    nestedGridField?: string;
    isChildTable?: boolean;
    expandableField?: string;
}
