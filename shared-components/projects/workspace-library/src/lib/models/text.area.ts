import { FormField } from './form.field';

export interface TextArea extends FormField {
  rows?: number;
  placeholder?: string;
  keyup?: (event: KeyboardEvent) => void;
  blur?: (event: FocusEvent) => void;
  customClass?: string;
}
