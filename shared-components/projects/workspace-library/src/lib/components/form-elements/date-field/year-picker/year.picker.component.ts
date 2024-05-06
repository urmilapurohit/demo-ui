import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import {
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import * as _moment from 'moment';
import { Moment } from 'moment';
import { DateField } from '../../../../models/date.field';

const MY_FORMATS = {
  parse: {
    dateInput: 'YYYY',
  },
  display: {
    dateInput: 'YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

@Component({
  selector: 'lib-year-picker',
  templateUrl: './year.picker.component.html',
  styleUrl: './year.picker.component.css',
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
export class YearPickerComponent implements OnInit {
  @Input() config!: DateField;
  @Input() startView!: "month" | "year" | "multi-year";
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

  get placeholder() {
    return this.config.placeholder ? this.config.placeholder : '';
  }

  get formControlName() {
    return this.config.formControlName;
  }

  get control(): AbstractControl | null {
    return this.formGroup.get(this.formControlName);
  }

  onChangeDate = (): void => {
    console.log(this.control?.value);
    if (this.config.onChangeDate) {
      this.config.onChangeDate(this.control?.value);
    }
    this.control?.updateValueAndValidity();
  };

  onKeyDown = (event:KeyboardEvent): boolean => {
    if (this.config.needOnKeyDown) {
      if(event.key == "Backspace" || event.key == "Delete"){
        this.control?.patchValue('');
        return true;
      }
      else{
        return false;
      }
    }
    this.control?.updateValueAndValidity();
    return true;
  };

  onEnterPress = (): void => {
    if (this.config.onEnterPress) {
      this.config.onEnterPress(this.control?.value);
    }
    this.control?.updateValueAndValidity();
  };

  chosenYearHandler(normalizedYear: Moment, yearPicker: any) {
    const ctrlValue = this.control?.value;
    ctrlValue?.year(normalizedYear.year());
    this.control?.setValue(ctrlValue);
    yearPicker.close();
  }
}
