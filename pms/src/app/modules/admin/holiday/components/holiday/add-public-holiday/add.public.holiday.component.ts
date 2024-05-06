/* eslint-disable import/no-extraneous-dependencies */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseResponseModel, Button, ButtonType, DateField, GlobalService, InputType, MinMaxDateValidator, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbItem } from '@models/common.model';
import { GLOBAL_CONSTANTS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { DateFormats } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { HolidayService } from '../../../services/holiday.service';
import { IHoliday, IHolidayObject } from '../../../models/holiday';

@Component({
  selector: 'app-add.public.holiday',
  templateUrl: './add.public.holiday.component.html',
  styleUrl: './add.public.holiday.component.css'
})
export class AddPublicHolidayComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addPublicHolidayForm!: FormGroup;
  name!: TextField;
  date!: DateField;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  holidayId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  today = new Date();
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: HolidayService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.holidayId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.holidayId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addPublicHolidayForm.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getPublicHolidayById(Number(this.holidayId));
    }
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
    const LABEL = this.isEdit ? 'Edit Public Holiday' : 'Add Public Holiday';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Holiday', link: ROUTES.ADMIN.HOLIDAY.HOLIDAY_ABSOLUTE },
      { label: LABEL, link: '' }
    ];
  }

  private initializeForm(): void {
    this.addPublicHolidayForm = this.fb?.group({
      name: ["", [Validators.required]],
      date: ["", [Validators.required, MinMaxDateValidator(new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()), new Date(new Date().getFullYear() + 1, 11, 31))]],
    });
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.date = {
      label: 'Date',
      formControlName: 'date',
      onChangeDate: () => { },
      onEnterPress: () => { this.OnSave(); },
      needOnKeyDown: false,
      isRequired: true,
      min: () => { return new Date(this.today.getFullYear(), this.today.getMonth(), this.today.getDate()); },
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

  private getPublicHolidayById(id: number) {
    this.service.getPublicHolidayById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IHolidayObject>) => {
        if (res.isSuccess && res.data) {
          this.addPublicHolidayForm.setValue({
            name: res.data?.remark || "",
            date: res.data?.date || new Date("")
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addPublicHolidayForm.valid) {
      const data: IHoliday = {
        remark: this.f?.['name']?.value,
        date: this.uiService.convertDateFormat(this.f?.['date']?.value, DateFormats.YYYY_MM_DD),
        isPublicHoliday: true
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updatePublicHoliday(Number(this.holidayId), data) : this.service.addPublicHoliday(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
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
  }
  // #endregion
}
