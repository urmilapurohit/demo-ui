import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { TextArea } from '../../../models/text.area';

@Component({
  selector: 'lib-text-area',
  templateUrl: './text.area.component.html',
  styleUrl: './text.area.component.css',
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class TextAreaComponent implements OnInit {
  @Input() config!: TextArea;
  @Input() isSubmitted: boolean = false;
  formGroup!: FormGroup;

  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.formGroup = <FormGroup> this.controlContainer.control;
  }

  get placeholder(): string | undefined {
    return this.config.placeholder ? this.config.placeholder : '';
  }

  onKeyUp = (event: KeyboardEvent): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.config.keyup && this.config.keyup(event);
  };

  onBlur = (event: FocusEvent): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.config.blur && this.config.blur(event);
  };

  get customClass(): string {
    return this.config.customClass ? this.config.customClass : '';
  }
}
