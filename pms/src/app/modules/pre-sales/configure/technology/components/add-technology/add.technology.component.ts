import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, ButtonType, GLOBAL_CONSTANTS, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbItem } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { MaxDisplayOrder } from '@constants/constant';
import { Subject, takeUntil } from 'rxjs';
import { TechnologyService } from '../../services/technology.service';
import { ITechnology, ITechnologyObject } from '../../models/technology.model';

@Component({
  selector: 'app-add-technology',
  templateUrl: './add.technology.component.html',
  styleUrl: './add.technology.component.css'
})
export class AddTechnologyComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addTechnologyFormGroup!: FormGroup;
  name!: TextField;
  displayOrder!: TextField;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  technologyId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: TechnologyService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {
    this.technologyId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.technologyId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addTechnologyFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getTechnologyById(Number(this.technologyId));
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
    const LABEL = this.isEdit ? 'Edit Technology' : 'Add Technology';
    this.breadcrumbItems = [
      { label: 'Pre-Sales', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Technology', link: ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.TECHNOLOGY_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addTechnologyFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(200)]],
      displayOrder: [null, [Validators.required, Validators.min(1), Validators.max(MaxDisplayOrder)]]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = {
      id: 'applyButton',
      buttonText: GLOBAL_CONSTANTS.SAVE,
      buttonType: ButtonType.default,
      className: 'primary-btn',
      disableCallBack: () => this.loading,
      callback: () => { this.OnSave(); }
    };
    this.cancelButtonConfig = {
      id: 'cancelButton',
      buttonText: GLOBAL_CONSTANTS.CANCEL,
      buttonType: ButtonType.default,
      className: 'primary-border-btn',
      callback: () => { this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.TECHNOLOGY_ABSOLUTE]); }
    };
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control large-width-field',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.displayOrder = {
      label: 'Display Order',
      formControlName: 'displayOrder',
      type: InputType.number,
      customClass: 'custom-form-control large-width-field',
      isRequired: true,
      onEnterPress: () => { this.OnSave(); }
    };
  };

  private getTechnologyById(id: number) {
    this.service.getTechnologyById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ITechnologyObject>) => {
        if (res.isSuccess && res.data) {
          this.addTechnologyFormGroup.setValue({
            name: res.data?.name || "",
            displayOrder: res.data?.displayOrder
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addTechnologyFormGroup.valid) {
      const data: ITechnology = {
        name: this.f?.['name']?.value,
        displayOrder: this.f?.['displayOrder']?.value,
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateTechnology(Number(this.technologyId), data) : this.service.addTechnology(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ITechnologyObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.TECHNOLOGY.TECHNOLOGY_ABSOLUTE]);
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
