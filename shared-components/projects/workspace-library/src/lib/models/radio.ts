import { MatRadioChange } from '@angular/material/radio';
import { FormField } from './form.field';

export interface Radio extends FormField {
    change?: (event: MatRadioChange, formControlName?: string) => void;
    options:{value:any, label:string, checked:boolean}[]
}
