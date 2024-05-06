export interface FileInput {
    maxSize: number;
    multipleSelection: boolean;
    allowedExtensions: string[];
    label: string;
    isRequired?: boolean;
    suggestionMessage?: string;
}
