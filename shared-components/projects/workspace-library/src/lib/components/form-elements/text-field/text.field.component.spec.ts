import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';
import { TextFieldComponent } from './text.field.component';
import { InputType, TextField } from '../../../models/text.field';
import { MaterialModule } from '../../../material/material.module';
import { testPasswordConfig, testTextBoxConfig } from '../testdata';

describe('TextFieldComponent', () => {
  let component: TextFieldComponent;
  let fixture: ComponentFixture<TextFieldComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextFieldComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [FormGroupDirective],
    });

    fixture = TestBed.createComponent(TextFieldComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set properties according to config', () => {
    const formGroup = new FormGroup({
      test: new FormControl(),
    });
    component.formGroup = formGroup;
    // Act
    const textFieldConfig:TextField = testTextBoxConfig;
    component.config = textFieldConfig;
    component.ngOnInit();
    expect(component.config).toEqual(testTextBoxConfig);
  });

  it('should call enterOnPress', () => {
    const testFieldConfig:TextField = testTextBoxConfig;
    const consoleSpy = spyOn(console, 'log');
    component.config = testFieldConfig;
    component.onEnterPress();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onblur', () => {
    const testFieldConfig:TextField = testTextBoxConfig;
    const consoleSpy = spyOn(console, 'log');
    component.config = testFieldConfig;
    component.onBlur();
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should change inputtype to type password', () => {
    const textFieldConfig:TextField = testPasswordConfig;
    component.config = textFieldConfig;
    component.onInputTypeChange(textFieldConfig, 'password');
    expect(component.config.type).toBe(InputType.text);
  });
  it('should change inputtype', () => {
    const textFieldConfig:TextField = testPasswordConfig;
    component.config = textFieldConfig;
    component.onInputTypeChange(textFieldConfig, 'text');
    expect(component.config.type).toBe(InputType.password);
  });
  it('should return correct form control name', () => {
    const textFieldConfig: TextField = testTextBoxConfig;
    component.config = textFieldConfig;
    expect(component.formControlName).toBe('test');
  });

  it('should return correct control', () => {
    const formGroup = new FormGroup({
      test: new FormControl('initial value'),
    });
    component.formGroup = formGroup;
    const textFieldConfig: TextField = testTextBoxConfig;
    component.config = textFieldConfig;
    expect(component.formGroup.value.test).toBe('initial value');
  });

  it('should return placeholder when provided', () => {
    const textFieldConfig: TextField = testTextBoxConfig;
    component.config = textFieldConfig;

    expect(component.placeholder).toBe('Test');
  });

  it('should return an empty string when no placeholder is provided', () => {
    const textFieldConfig: TextField = {
      label: 'Test',
      formControlName: 'test',
      type: InputType.text,
      customClass: 'custom-form-control',
    };
    component.config = textFieldConfig;
    expect(component.placeholder).toBe('');
  });
  it('should return email input type', () => {
    const textFieldConfig: TextField = testTextBoxConfig;
    textFieldConfig.type = InputType.email;
    component.config = textFieldConfig;

    expect(component.inputType).toBe('email');
  });

  it('should return number input type', () => {
    const textFieldConfig: TextField = testTextBoxConfig;
    textFieldConfig.type = InputType.number;
    component.config = textFieldConfig;

    expect(component.inputType).toBe('number');
  });

  it('should return password input type', () => {
    const textFieldConfig: TextField = testTextBoxConfig;
    textFieldConfig.type = InputType.password;
    component.config = textFieldConfig;

    expect(component.inputType).toBe('password');
  });

  it('should return text input type for default case', () => {
    const textFieldConfig: TextField = {
      label: 'Test',
      formControlName: 'test',
      type: InputType.text as InputType,
      customClass: 'custom-form-control',
    };
    component.config = textFieldConfig;
    expect(component.inputType).toBe('text');
  });

  it('should return custom class when provided', () => {
    const textFieldConfig: TextField = testTextBoxConfig;
    component.config = textFieldConfig;

    expect(component.customClass).toBe('custom-form-control');
  });

  it('should return an empty string when no custom class is provided', () => {
    const textFieldConfig: TextField = {
      label: 'Test',
      formControlName: 'test',
      type: InputType.text,
    };
    component.config = textFieldConfig;

    expect(component.customClass).toBe('');
  });
});
