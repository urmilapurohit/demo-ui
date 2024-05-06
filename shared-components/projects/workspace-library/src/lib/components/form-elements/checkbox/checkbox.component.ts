import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { Checkbox } from '../../../models/checkbox';

@Component({
  selector: 'lib-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css',
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CheckboxComponent implements OnInit {
  @Input() config!: Checkbox;
  formGroup!: FormGroup;

  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.formGroup = <FormGroup> this.controlContainer.control;
  }

  change = (event: MatCheckboxChange): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.config.change
      && this.config.change(event, this.config.formControlName);
  };

  click = (event: any): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.config.click && this.config.click(event);
  };
}
