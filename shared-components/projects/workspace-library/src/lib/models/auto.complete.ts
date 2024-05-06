import { FormField } from './form.field';

export interface AutoComplete extends FormField {
  options: string[];
  placeholder: string;
  onSelect?: (selectedValue: string) => void;
  onInput?: (inputValue: string) => void;
}
