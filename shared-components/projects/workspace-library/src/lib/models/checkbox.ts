import { MatCheckboxChange } from '@angular/material/checkbox';
import { FormField } from './form.field';

export interface Checkbox extends FormField {
  change?: (event: MatCheckboxChange, formControlName?: string) => void;
  click?: (event: PointerEvent) => void;
}
