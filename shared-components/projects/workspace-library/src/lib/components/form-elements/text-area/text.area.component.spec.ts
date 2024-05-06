import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
} from '@angular/forms';
import { TextField } from '../../../models/text.field';
import { MaterialModule } from '../../../material/material.module';
import { TextAreaComponent } from './text.area.component';
import { TextArea } from '../../../models/text.area';
import { testTextAreaConfig, testTextAreaConfigEmpty } from '../testdata';

describe('TextAreaComponent', () => {
  let component: TextAreaComponent;
  let fixture: ComponentFixture<TextAreaComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TextAreaComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [FormGroupDirective],
    });

    fixture = TestBed.createComponent(TextAreaComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set properties according to config', () => {
    const textFieldConfig: TextArea = testTextAreaConfig;
    component.config = textFieldConfig;
    const formGroup = new FormGroup({
      test: new FormControl(),
    });
    component.formGroup = formGroup;
    // Act
    component.ngOnInit();
    expect(component.config).toEqual(testTextAreaConfig);
  });

  it('should call onKeyUp when keyup event occurs', () => {
    const textAreaConfig: TextArea = testTextAreaConfig;
    const consoleSpy = spyOn(console, 'log');
    component.config = textAreaConfig;
    const textarea = fixture.nativeElement.querySelector('textarea');
    textarea.dispatchEvent(new KeyboardEvent('keyup'));
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should call onBlur when blur event occurs', () => {
    const textAreaConfig: TextArea = testTextAreaConfig;
    const consoleSpy = spyOn(console, 'log');
    component.config = textAreaConfig;
    const textarea = fixture.nativeElement.querySelector('textarea');
    textarea.dispatchEvent(new FocusEvent('blur'));
    expect(consoleSpy).toHaveBeenCalled();
  });

  it('should return placeholder when provided', () => {
    const textFieldConfig: TextArea = testTextAreaConfig;
    component.config = textFieldConfig;

    expect(component.placeholder).toBe('Test');
  });

  it('should return an empty string when no placeholder is provided', () => {
    const textFieldConfig: TextArea = testTextAreaConfigEmpty;
    component.config = textFieldConfig;

    expect(component.placeholder).toBe('');
  });

  it('should return custom class when provided', () => {
    const textFieldConfig: TextField = testTextAreaConfig;
    component.config = textFieldConfig;

    expect(component.customClass).toBe('custom-textarea');
  });

  it('should return an empty string when no custom class is provided', () => {
    const textFieldConfig: TextField = testTextAreaConfigEmpty;
    component.config = textFieldConfig;

    expect(component.customClass).toBe('');
  });
});
