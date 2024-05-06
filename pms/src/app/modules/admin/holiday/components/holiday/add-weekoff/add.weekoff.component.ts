import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import moment from 'moment';
import { BaseResponseModel, Button, ButtonType, DateField, GLOBAL_CONSTANTS, GlobalService, MinMaxYearValidator } from 'workspace-library';
import { BreadcrumbItem } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { DateFormats } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { HolidayService } from '../../../services/holiday.service';
import { IHolidayObject } from '../../../models/holiday';

@Component({
  selector: 'app-add.weekoff',
  templateUrl: './add.weekoff.component.html',
  styleUrl: './add.weekoff.component.css'
})
export class AddWeekoffComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addWeekoffForm!: FormGroup;
  date!: DateField;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: HolidayService,
    private router: Router,
    private uiService: UIService,
    private globalService: GlobalService
  ) { }
  // #endregion

  get f() {
    return this.addWeekoffForm.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Holiday', link: ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE },
      { label: 'Add Week-off', link: '' }
    ];
  }

  private initializeForm(): void {
    this.addWeekoffForm = this.fb?.group({
      date: new FormControl(moment(), [Validators.required, MinMaxYearValidator(new Date().getFullYear(), new Date().getFullYear() + 1)])
    });
  }

  private setTextBoxConfig = (): void => {
    this.date = {
      label: 'Year',
      placeholder: '',
      formControlName: 'date',
      onChangeDate: () => { },
      onEnterPress: () => { this.OnSave(); },
      needOnKeyDown: true,
      isYearPicker: true,
      isRequired: true,
      min: () => { return new Date(new Date().getFullYear(), 0, 1); },
      max: () => { return new Date(new Date().getFullYear() + 1, 11, 31); }
    };
  };

  private setButtonConfig(): void {
    this.saveButtonConfig = {
      id: 'applyButton',
      buttonText: GLOBAL_CONSTANTS.SAVE,
      buttonType: ButtonType.default,
      className: 'primary-btn',
      callback: () => { this.OnSave(); }
    };
    this.cancelButtonConfig = {
      id: 'cancelButton',
      buttonText: GLOBAL_CONSTANTS.CANCEL,
      buttonType: ButtonType.default,
      className: 'primary-border-btn',
      callback: () => { this.router.navigate([ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE]); }
    };
  }

  private OnSave(): void {
    this.submitted = true;
    const data = {
      year: Number(this.uiService.convertDateFormat(this.f?.['date']?.value, DateFormats.YYYY))
    };
    this.loading = true;
    this.service.addWeekOff(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IHolidayObject>) => {
        if (res.isSuccess) {
          this.loading = false;
          this.globalService.openSnackBar(res.message);
          this.router.navigate([ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE]);
        }
      },
      error: () => {
        this.loading = false;
      }
    });
  }
  // #endregion
}
