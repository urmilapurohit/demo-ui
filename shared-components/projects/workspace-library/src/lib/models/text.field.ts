import { FormField } from './form.field';

export interface TextField extends FormField {
  type?: InputType;
  placeholder?: string;
  customClass?: string;
  onEnterPress?: () => void;
  onBlur?: () => void;
  maxLength?: number;
  isLabelFloating?: boolean;
}

export enum InputType {
  text = 1,
  number = 2,
  email = 3,
  password = 4,
}
