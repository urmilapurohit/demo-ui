import { Component, Input, OnInit } from '@angular/core';
import {
  AbstractControl,
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { InputType, TextField } from '../../../models/text.field';

@Component({
  selector: 'lib-text-field',
  templateUrl: './text.field.component.html',
  styleUrl: './text.field.component.css',
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }]

})
export class TextFieldComponent implements OnInit {
  @Input() config!: TextField;
  @Input() isSubmitted: boolean = false;
  public formGroup!: FormGroup;
  showPassword: boolean = false;
  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.formGroup = <FormGroup> this.controlContainer.control;
  }

  get formControlName() {
    return this.config.formControlName;
  }

  get control(): AbstractControl | null {
    return this.formGroup.get(this.formControlName);
  }

  get placeholder() {
    return this.config.placeholder ? this.config.placeholder : '';
  }

  get inputType() {
    switch (this.config.type) {
      case InputType.email:
        return 'email';
      case InputType.number:
        return 'number';
      case InputType.password:
        return 'password';
      default:
        return 'text';
    }
  }
  get customClass(): string {
    return this.config.customClass ? this.config.customClass : '';
  }

  onEnterPress = (): void => {
    if (this.config.onEnterPress) this.config.onEnterPress();
  };

  onBlur = (): void => {
    if (this.config.onBlur) this.config.onBlur();
  };

  onInputTypeChange(config: TextField, inputType: string) {
    if (inputType === 'password') config.type = 1;
    else config.type = 4;
  }
}
