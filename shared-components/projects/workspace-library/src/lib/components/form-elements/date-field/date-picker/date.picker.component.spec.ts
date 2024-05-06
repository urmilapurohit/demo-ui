import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { DatePickerComponent } from './date.picker.component';
import { MaterialModule } from '../../../../material/material.module';
import { testDateConfig, testDateFieldConfig, testMaxDate, testMinDate } from '../../testdata';
import { DateField } from '../../../../models/date.field';

describe('DatePickerComponent', () => {
  let component: DatePickerComponent;
  let fixture: ComponentFixture<DatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DatePickerComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [FormGroupDirective],
    })
    .compileComponents();
    fixture = TestBed.createComponent(DatePickerComponent);
    component = fixture.componentInstance;
    const formGroup = new FormGroup({
      test: new FormControl(),
    });
    component.formGroup = formGroup;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should set properties according to config', () => {
    const dateFieldConfig:DateField = testDateConfig;
    component.config = dateFieldConfig;
    component.ngOnInit();
    expect(component.config).toEqual(testDateConfig);
  });
  it('should call onchange', () => {
    const datefieldconfig:DateField = testDateFieldConfig;
    const consoleSpy = spyOn(console, 'log');
    component.config = datefieldconfig;
    component.onChangeDate();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onEnterPress and update value and validity', () => {
    const datefieldconfig:DateField = testDateFieldConfig;
    const consoleSpy = spyOn(console, 'log');
    component.config = datefieldconfig;
    component.onEnterPress();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should return minDate when config.min is defined', () => {
    const config: DateField = testMinDate;

    component.config = config;
    expect(component.minDate).toEqual(new Date('2022-01-01'));
    expect(config.min).toHaveBeenCalled();
  });

  it('should return null minDate when config.min is not defined', () => {
    const config: DateField = testDateConfig;
    component.config = config;
    expect(component.minDate).toBeNull();
  });

  it('should return maxDate when config.max is defined', () => {
    const config: DateField = testMaxDate;
    component.config = config;
    expect(component.maxDate).toEqual(new Date('2022-12-31'));
    expect(config.max).toHaveBeenCalled();
  });

  it('should return null maxDate when config.max is not defined', () => {
    const config: DateField = testDateConfig;
    component.config = config;

    expect(component.maxDate).toBeNull();
  });

  it('should return correct form control name', () => {
    const dateFieldConfig: DateField = testDateConfig;
    component.config = dateFieldConfig;
    expect(component.formControlName).toBe('test');
  });

  it('should return correct control', () => {
    const formGroup = new FormGroup({
      test: new FormControl('initial value'),
    });
    const dateFieldConfig: DateField = testDateConfig;
    component.config = dateFieldConfig;
    component.formGroup = formGroup;
    expect(component.formGroup.value.test).toBe('initial value');
  });
});
