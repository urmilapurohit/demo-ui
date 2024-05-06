import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, ButtonType, DropDown, DropdownValue, GlobalService, InputType, TextArea, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTIVE_INACTIVE_STATUS_LABEL, GLOBAL_CONSTANTS, MaxDisplayOrder } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { LookupCategoryDetailService } from '../../../services/lookup.category.detail.service';
import { ILookupCategoryDetail, ILookupCategoryDetailObject } from '../../../models/lookup.category.detail';

@Component({
  selector: 'app-add.lookup.category.detail',
  templateUrl: './add.lookup.category.detail.component.html',
  styleUrl: './add.lookup.category.detail.component.css'
})
export class AddLookupCategoryDetailComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addLookupCategoryDetailFormGroup!: FormGroup;
  name!: TextField;
  lookupCategory!: DropDown;
  status!: DropDown;
  description!: TextArea;
  displayOrder!: TextField;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  lookupCategoryDetailId: string = '';
  lookupCategoryList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: LookupCategoryDetailService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.lookupCategoryDetailId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.lookupCategoryDetailId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addLookupCategoryDetailFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getLookupCategoryDetailById(Number(this.lookupCategoryDetailId));
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.getLookupCategoryList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Lookup Category Detail' : 'Add Lookup Category Detail';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Lookup Category Detail', link: ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.LOOKUP_CATEGORY_DETAIL_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private getLookupCategoryList() {
    this.uiService.getDropdownOptions(this.service.getEditableLookupCategories(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.lookupCategoryList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.addLookupCategoryDetailFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(150)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]],
      lookupCategory: ["", [Validators.required]],
      description: ["", Validators.maxLength(500)],
      displayOrder: [null, [Validators.required, Validators.min(1), Validators.max(MaxDisplayOrder)]]
    });
  }

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
      callback: () => { this.router.navigate([ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.LOOKUP_CATEGORY_DETAIL_ABSOLUTE]); }
    };
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

    this.lookupCategory = {
      data: {
        data: this.lookupCategoryList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'lookupCategory',
      formControlName: 'lookupCategory',
      label: 'Lookup Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.description = {
      label: 'Description',
      formControlName: 'description',
      rows: 15,
      placeholder: '',
      customClass: 'custom-form-control'
    };

    this.displayOrder = {
      label: 'Display Order',
      formControlName: 'displayOrder',
      type: InputType.number,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);
  };

  private getLookupCategoryDetailById(id: number) {
    this.service.getLookupCategoryDetailById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ILookupCategoryDetailObject>) => {
        if (res.isSuccess && res.data) {
          this.addLookupCategoryDetailFormGroup.setValue({
            name: res.data?.name || "",
            lookupCategory: res.data?.lookupCategoryId || "",
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            displayOrder: res.data?.displayOrder,
            description: res.data?.description || ""
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addLookupCategoryDetailFormGroup.valid) {
      const data: ILookupCategoryDetail = {
        name: this.f?.['name']?.value,
        lookupCategoryId: this.f?.['lookupCategory']?.value,
        isActive: this.f?.['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        displayOrder: this.f?.['displayOrder'].value,
        description: this.f?.['description'].value
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateLookupCategoryDetail(Number(this.lookupCategoryDetailId), data) : this.service.addLookupCategoryDetail(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ILookupCategoryDetailObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.LOOKUP_CATEGORY_DETAIL.LOOKUP_CATEGORY_DETAIL_ABSOLUTE]);
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
