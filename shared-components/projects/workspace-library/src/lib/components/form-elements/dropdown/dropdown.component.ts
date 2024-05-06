import { AfterViewInit, Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { MatOption, MatSelect } from '@angular/material/select';
import { DropDown, DropdownValue } from '../../../models/dropdown';

@Component({
  selector: 'lib-dropdown',
  templateUrl: './dropdown.component.html',
  styleUrl: './dropdown.component.css',
  providers: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class DropdownComponent implements OnInit, OnChanges, OnDestroy, AfterViewInit {
  @Input() config!: DropDown;
  @Input() isSubmitted: boolean = false;
  parentFormGroup!: FormGroup;
  public dropDownOptions!: DropdownValue[];
  isDisabled!: boolean;
  allOptionValue: number = 0;
  selectedColorValue: string | null = null;
  searchForm !: FormGroup;
  public filteredOptions: ReplaySubject<DropdownValue[]> = new ReplaySubject<DropdownValue[]>(1);
  @ViewChild('singleSelect', { static: true }) singleSelect!: MatSelect;
  @ViewChild('select') select!: MatSelect;
  allSelected = false;

  protected destroy = new Subject<void>();
  constructor(private controlContainer: ControlContainer, private fb: FormBuilder) { }

  get isAllowMultiple(): boolean {
    return !!this.config.feature?.allowMultiple;
  }

  get isColorDropDown(): boolean {
    return !!this.config.feature?.isColorDropDown;
  }

  public get getCustomFormFieldClass(): string {
    return this.config?.customFormFieldClass ? this.config?.customFormFieldClass : '';
  }

  public get getCustomSelectClass(): string {
    return this.config?.customSelectClass ? this.config?.customSelectClass : '';
  }

  ngOnInit(): void {
    this.parentFormGroup = <FormGroup> this.controlContainer.control;
    this.prepareDropdownOptions();
    setTimeout(() => {
      this.selectedColorValue = this.parentFormGroup.value[this.config.formControlName];
    }, 500);
    this.searchForm = this.fb?.group({
      searchTxt: [""]
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['config']?.firstChange) {
      this.prepareDropdownOptions();
    }
  }

  ngAfterViewInit() {
    this.searchForm?.controls['searchTxt'].valueChanges
      .pipe(takeUntil(this.destroy))
      .subscribe(() => {
        this.filterOptions();
      });
    this.subscribeValue();
  }

  setDropdownOptions = (data: DropdownValue[]) => {
    this.dropDownOptions = data;
  };

  onEnterPress = (): void => {
    if (this.config.onEnterPress) this.config.onEnterPress();
  };

  toggleSingleSelection() {
    let newStatus = true;
    this.select.options.filter((item) => item?.value !== undefined).forEach((item: MatOption) => {
      if (!item.selected) {
        newStatus = false;
      }
    });
    this.allSelected = newStatus;
  }

  toggleAllSelection() {
    if (this.allSelected) {
      this.select.options.filter((item) => item?.value !== undefined).forEach((item: MatOption) => item.select());
    } else {
      this.select.options.filter((item) => item?.value !== undefined).forEach((item: MatOption) => item.deselect());
    }
  }

  subscribeValue() {
    if (this.config?.feature?.allowMultiple && this.select) {
      this.parentFormGroup.valueChanges.subscribe(() => {
        this.toggleSingleSelection();
      });
    }
  }

  public selectionChange = (event: any) => {
    this.selectedColorValue = event.value;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    this.config.selectionChange && this.config.selectionChange(event, this.config.formControlName);
  };

  protected filterOptions() {
    if (!this.dropDownOptions) {
      return;
    }

    let search = this.searchForm.get('searchTxt')?.value ?? "";
    if (!search) {
      this.filteredOptions.next(this.dropDownOptions.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredOptions.next(
      this.dropDownOptions.filter((x) => x.text.toLowerCase().indexOf(search) > -1)
    );
  }

  private prepareDropdownOptions = () => {
    this.setDropdownOptions(this.config.data.data);
    this.filteredOptions.next(this.config.data?.data?.slice());
  };

  ngOnDestroy() {
    this.destroy.next();
    this.destroy.complete();
  }
}
