import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { SimpleChange, SimpleChanges } from '@angular/core';
import { MaterialModule } from '../../../material/material.module';
import { DropdownComponent } from './dropdown.component';
import { DropDown } from '../../../models/dropdown';
import { testDropDownSimpleChnage, testDropdownConfig } from '../testdata';

describe('DropDownComponent', () => {
  let component: DropdownComponent;
  let fixture: ComponentFixture<DropdownComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropdownComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [FormGroupDirective],
    });
    fixture = TestBed.createComponent(DropdownComponent);
    component = fixture.componentInstance;
    component.config = testDropdownConfig;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });
  it('should call preparedropdownoption on ngchnagescall', () => {
    const changes: SimpleChanges = testDropDownSimpleChnage;
    component.ngOnChanges(changes);
  });
  it('should set properties according to config', () => {
    component.config = testDropdownConfig;
    expect(component.config).toEqual(testDropdownConfig);
    expect(component.getCustomFormFieldClass).toBe('test-class');
    expect(component.getCustomSelectClass).toBe('test-class');
  });

  it('should call enterOnPress', () => {
    const testFieldConfig:DropDown = testDropdownConfig;
    const consoleSpy = spyOn(console, 'log');
    component.config = testFieldConfig;
    component.onEnterPress();
    expect(consoleSpy).toHaveBeenCalled();
  });
  it('should call selectionChange when selection changes', () => {
    const dropDownConfig: DropDown = testDropdownConfig;
    const consoleSpy = spyOn(console, 'log');
    component.config = dropDownConfig;
    component.selectionChange({});
    expect(consoleSpy).toHaveBeenCalledWith('Selection change event triggered');
  });
  it('should call prepareDropdownOptions when config changes after the first change', () => {
    const dropDownConfig: DropDown = testDropdownConfig;
    component.config = dropDownConfig;
    component.ngOnInit();
    const simpleChanges: SimpleChanges = {
      config: new SimpleChange(null, dropDownConfig, true),
    };
    component.ngOnChanges(simpleChanges);
  });
  it('should return true if allowMultiple is true in the feature', () => {
    const result = component.isAllowMultiple;
    expect(result).toBeTruthy();
  });
});
