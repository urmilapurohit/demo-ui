import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../../../material/material.module';
import { CheckboxComponent } from './checkbox.component';
import { Checkbox } from '../../../models/checkbox';
import { testCheckBoxConfig } from '../testdata';

describe('CheckBox', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CheckboxComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [FormGroupDirective],
    });
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set properties according to config', () => {
    const checkBoxConfig: Checkbox = testCheckBoxConfig;
    component.config = checkBoxConfig;
    const formGroup = new FormGroup({
      test: new FormControl(),
    });
    component.formGroup = formGroup;
    component.ngOnInit();
    expect(component.config).toEqual(testCheckBoxConfig);
  });

  it('should call change when checkbox  changes', () => {
    const slideToggleConfig: Checkbox = testCheckBoxConfig;
    const consoleSpy = spyOn(console, 'log');
    component.config = slideToggleConfig;
    const checkBox = fixture.nativeElement.querySelector('mat-checkbox');
    checkBox.dispatchEvent(new Event('change'));

    expect(consoleSpy).toHaveBeenCalledWith('change event triggered');
  });

  it('should call click when checkbox  is clicked', () => {
    const checkBoxConfig: Checkbox = testCheckBoxConfig;
    const consoleSpy = spyOn(console, 'log');
    component.config = checkBoxConfig;
    const checkBox = fixture.nativeElement.querySelector('mat-checkbox');
    checkBox.dispatchEvent(new Event('click'));

    expect(consoleSpy).toHaveBeenCalledWith('click event triggered');
  });
});
