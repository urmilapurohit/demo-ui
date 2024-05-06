import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { SlideToggel } from '../../../models/slide.toggel';

@Component({
  selector: 'lib-slide-toggle',
  templateUrl: './slide.toggle.component.html',
  styleUrl: './slide.toggle.component.css',
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class SlideToggleComponent implements OnInit {
  @Input() config!: SlideToggel;
  formGroup!: FormGroup;

  constructor(private controlContainer: ControlContainer) {}

  ngOnInit(): void {
    this.formGroup = <FormGroup> this.controlContainer.control;
  }

  change = (event: MatSlideToggleChange): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.config.change && this.config.change(event);
  };

  click = (event: any): void => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.config.click && this.config.click(event);
  };
}
