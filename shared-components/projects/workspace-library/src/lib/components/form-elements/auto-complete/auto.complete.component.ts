import { Component, Input, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { Observable, of } from 'rxjs';
import { AutoComplete } from '../../../models/auto.complete';

@Component({
  selector: 'lib-auto-complete',
  templateUrl: './auto.complete.component.html',
  styleUrl: './auto.complete.component.css',
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class AutoCompleteComponent implements OnInit {
  @Input() config!: AutoComplete;
  @Input() isSubmitted: boolean = false;
  formGroup!: FormGroup;
  filteredOptions: Observable<string[]> = of([]);

  constructor(private controlContainer: ControlContainer) { }

  ngOnInit(): void {
    this.formGroup = this.controlContainer.control as FormGroup;
    this.filteredOptions = of(this.config.options);
  }

  onOptionSelected(event: MatAutocompleteSelectedEvent): void {
    const selectedValue = event.option.value as string;
    if (this.config.onSelect) {
      this.config.onSelect(selectedValue);
    }
  }

  onInput(event: Event): void {
    const inputValue = (event.target as HTMLInputElement).value;
    if (inputValue.length > 2) {
      if (this.config.onInput) {
        this.config.onInput(inputValue);
      }
      this.filteredOptions = of(this.filter(inputValue));
    }
    else {
      this.filteredOptions = of([]);
    }
  }

  private filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.config.options.filter((option) => option.toLowerCase().includes(filterValue));
  }
}
