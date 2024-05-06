import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { FormField } from './form.field';

export interface SlideToggel extends FormField {
  change?: (event: MatSlideToggleChange) => void;
  click?: (event: PointerEvent) => void;
}
