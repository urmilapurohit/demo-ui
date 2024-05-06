import { ButtonType } from "../button";
import { DataGridFullRowData } from "./data-grid-data.config";

export interface DataGridActionButton<T> {
    className?: string;
    btnIcon?: string;
    btnType: ButtonType;
    btnImageSrc?: string;
    btnAlternateSrc?: string;
    btnText?: string;
    isEditButton?: boolean;
    tooltip?: string,
    isBooleanBtn?: boolean;
    booleanField?: string;
    alterTooltip?:string;
    visibleCallback?: (element: T) => boolean;
    callback?: (data: DataGridFullRowData<T>) => void;
}
