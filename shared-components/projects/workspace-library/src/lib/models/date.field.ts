import { FormField } from './form.field';

export interface DateField extends FormField {
  min?(): Date | null;
  max?(): Date | null;
  placeholder?: string;
  onChangeDate?(data: any): void;
  onEnterPress?(data: any): void;
  needOnKeyDown?: boolean;
  isHidden?: boolean;
  hint?: string;
  isYearPicker?: boolean;
}
