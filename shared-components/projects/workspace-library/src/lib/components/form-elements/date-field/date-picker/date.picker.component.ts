import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_MOMENT_DATE_ADAPTER_OPTIONS, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateField } from '../../../../models/date.field';

const MY_FORMATS = {
  parse: {
    dateInput: 'DD-MMM-YYYY',
  },
  display: {
    dateInput: 'DD-MMM-YYYY',
    monthYearLabel: 'DD-MMM-YYYY',
    dateA11yLabel: 'DD-MMM-YYYY',
    monthYearA11yLabel: 'DD-MMM-YYYY',
  },
};

@Component({
  selector: 'lib-date-picker',
  templateUrl: './date.picker.component.html',
  styleUrl: './date.picker.component.css',
  providers: [
    { provide: ControlContainer, useExisting: FormGroupDirective },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
  ],
})
export class DatePickerComponent implements OnInit {
  @Input() config!: DateField;
  @Input() startView!: "multi-year";
  public formGroup!: FormGroup;
  @Input() isSubmitted: boolean = false;
  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.formGroup = <FormGroup> this.controlContainer.control;
  }

  get minDate(): Date | null {
    if (this.config.min) {
      return this.config.min();
    }
    return null;
  }

  get maxDate(): Date | null {
    if (this.config.max) {
      return this.config.max();
    }
    return null;
  }

  get formControlName() {
    return this.config.formControlName;
  }

  get placeholder() {
    return this.config.placeholder ? this.config.placeholder : '';
  }

  get control(): AbstractControl | null {
    return this.formGroup.get(this.formControlName);
  }

  onChangeDate = (): void => {
    if (this.config.onChangeDate) {
      this.config.onChangeDate(this.control?.value);
    }
    // this.control?.updateValueAndValidity();
  };

  onKeyDown = (event: KeyboardEvent): boolean => {
    if (this.config.needOnKeyDown) {
      if (event.key === "Backspace" || event.key === "Delete") {
        this.control?.patchValue('');
        return true;
      }
      else {
        return false;
      }
    }
    if (!this.control?.disabled) this.control?.updateValueAndValidity();
    return true;
  };

  onEnterPress = (): void => {
    if (this.config.onEnterPress) {
      this.config.onEnterPress(this.control?.value);
    }
    if (!this.control?.disabled) this.control?.updateValueAndValidity();
  };
}
