import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { MatRadioChange } from '@angular/material/radio';
import { Radio } from '../../../models/radio';

@Component({
  selector: 'lib-radiobutton',
  templateUrl: './radiobutton.component.html',
  styleUrl: './radiobutton.component.css',
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class RadiobuttonComponent implements OnInit {
  @Input() config!: Radio;
  formGroup!: FormGroup;

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.formGroup = <FormGroup> this.controlContainer.control;
  }
  change = (event: MatRadioChange): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.config.change
      && this.config.change(event, this.config.formControlName);
  };
}
