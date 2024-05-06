import { Component, Input } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { DateField } from '../../../models/date.field';

@Component({
  selector: 'lib-date-field',
  templateUrl: './date.field.component.html',
  styleUrl: './date.field.component.css',
  providers: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ],
})
export class DateFieldComponent {
  @Input() config!: DateField;
  @Input() startView!: "month" | "year" | "multi-year";
  public formGroup!: FormGroup;
  @Input() isSubmitted: boolean = false;
}
