/* eslint-disable no-plusplus */
export function validateFile(selectedFile: File[] | null, allowedExtensions: string[], maxSize: number, isRequired?: boolean): string {

    if (!selectedFile && isRequired) {
        return '*File Is Required.';
    }

    if (selectedFile !== null) {
        for (let i = 0; i < selectedFile.length; i++) {
            const fileName = selectedFile[i]?.name;
            const fileExtension = `.${fileName.substring(fileName.lastIndexOf('.') + 1)}`;
            const fileSizeInMB = selectedFile[i].size / (1024 * 1024);

            if (
                allowedExtensions?.length !== 0
                && !allowedExtensions?.includes(fileExtension ?? '')
            ) {
                return '*Invalid file extension.';
            }

            if (fileSizeInMB > maxSize) {
                return `*Maximum file size allowed is ${maxSize}mb.`;
            }
        }
    }

    return ''; // No error message if validation passes
}
