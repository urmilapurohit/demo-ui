export interface FormField {
  formControlName: string;
  label: string;
  customFormFieldClass?: string;
  customSelectClass?: string;
  isRequired?: boolean;
}
export type FormFieldType =
  | 'text'
  | 'dropdown'
  | 'password'
  | 'checkbox'
  | 'slidetoggle'
  | 'datepicker'
  | 'textarea'
  | 'custom-input'
  | 'radio'
  | 'autocomplete';
