import { Component, Input } from '@angular/core';
import { ControlContainer, FormGroupDirective } from '@angular/forms';
import { TextField } from '../../../models/text.field';
import { FormFieldType } from '../../../models/form.field';
import { TextArea } from '../../../models/text.area';
import { Checkbox } from '../../../models/checkbox';
import { SlideToggel } from '../../../models/slide.toggel';
import { DropDown } from '../../../models/dropdown';
import { AutoComplete } from '../../../models/auto.complete';
import { Radio } from '../../../models/radio';
import { DateField } from '../../../models/date.field';

@Component({
  selector: 'lib-form-field',
  templateUrl: './form.field.component.html',
  styleUrl: './form.field.component.css',
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class FormFieldComponent {
  @Input() type!: FormFieldType;
  @Input() config!:
    | TextField
    | TextArea
    | Checkbox
    | DropDown
    | Radio
    | AutoComplete;
  @Input() isSubmitted: boolean = false;
  @Input() startView!: "month" | "year" | "multi-year";

  get configTypeText(): TextField {
    return this.config as TextField;
  }

  get configTypeTextArea(): TextArea {
    return this.config as TextArea;
  }

  get configTypeDropdown(): DropDown {
    return this.config as DropDown;
  }

  get configTypeCheckbox(): Checkbox {
    return this.config as Checkbox;
  }

  get configTypeRadio(): Radio {
    return this.config as Radio;
  }

  get configTypeSlideToggle(): SlideToggel {
    return this.config as SlideToggel;
  }

  get configTypeAutoComplete(): AutoComplete {
    return this.config as AutoComplete;
  }

  get configTypeDatePicker(): DateField {
    return this.config as DateField;
  }

  get getConfigTypeStartView(): "month" | "year" | "multi-year" {
    return this.startView as "month" | "year" | "multi-year";
  }
}
