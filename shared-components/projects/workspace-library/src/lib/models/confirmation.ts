export interface IConfirmationModalData {
    title: string;
    bodyMessage: string;
    showConfirmBtn?: boolean;
    confirmBtnName?: string;
    confirmCallBackAction?: string;
    showCancelBtn?: boolean;
    cancelBtnName?: string;
    cancelCallBackAction?: string;
    showCustomBtn?: boolean;
    customBtnName?: string;
    customBtnClassname?: string;
    customBtnCallback?: () => void
}
