import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, FormGroup, FormGroupDirective, ReactiveFormsModule } from '@angular/forms';

import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MaterialModule } from '../../../material/material.module';
import { AutoCompleteComponent } from './auto.complete.component';
import { testAutoCompleteConfig } from '../testdata';

describe('AutoComplete', () => {
  let component: AutoCompleteComponent;
  let fixture: ComponentFixture<AutoCompleteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AutoCompleteComponent],
      imports: [ReactiveFormsModule, MaterialModule],
      providers: [FormGroupDirective],
    });
    fixture = TestBed.createComponent(AutoCompleteComponent);
    component = fixture.componentInstance;
    component.config = testAutoCompleteConfig;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should set properties according to config', () => {
    component.config = testAutoCompleteConfig;
    const formGroup = new FormGroup({
      test: new FormControl(),
    });
    component.formGroup = formGroup;
    component.ngOnInit();
    expect(component.config).toEqual(testAutoCompleteConfig);
  });
  it('should call onSelect method on option selected', () => {
    component.config = testAutoCompleteConfig;
    const spyOnSelect = spyOn<any>(component.config, 'onSelect');
    const selectedEvent = {
      option: {
        value: 'India',
      },
    } as MatAutocompleteSelectedEvent;

    // Act
    component.onOptionSelected(selectedEvent);

    // Assert
    expect(spyOnSelect).toHaveBeenCalledWith('India');
  });
  it('should call onInput method and update filteredOptions', () => {
    component.config = testAutoCompleteConfig;
    // Arrange
    const spyOnInput = spyOn<any>(component.config, 'onInput');
    const inputValue = 'In';

    // Act
    component.onInput({
        target: {
            value: inputValue,
        } as HTMLInputElement,
    } as unknown as Event);

    // Assert
    expect(spyOnInput).toHaveBeenCalledWith('In');
    component.filteredOptions.subscribe((options) => {
      expect(options).toEqual(['India', 'china', 'Indonesia']);
    });
  });
});
