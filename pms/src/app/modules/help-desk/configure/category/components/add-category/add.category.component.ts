import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BaseResponseModel, Button, DropDown, DropdownValue, GlobalService, InputType, TextArea, TextField } from 'workspace-library';
import { ROUTES } from '@constants/routes';
import { BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { ICategory, ICategoryObject } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add.category',
  templateUrl: './add.category.component.html',
  styleUrl: './add.category.component.css'
})
export class AddCategoryComponent implements OnInit, OnDestroy {
  // #region class members
  addCategoryFormGroup!: FormGroup;
  name!: TextField;
  description!: TextArea;
  department!: DropDown;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  departmentList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region class members
  constructor(
    private fb: FormBuilder,
    private service: CategoryService,
    private router: Router,
    private globalService: GlobalService,
    private uiService: UIService
  ) {}

  // #endregion

  get f() {
    return this.addCategoryFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.getDepartmentItems();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class members

  getDepartmentItems() {
    this.uiService.getDropdownOptions(this.service.getDepartments(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.departmentList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.addCategoryFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      department: ["", [Validators.required]],
      description: ["", [Validators.maxLength(1000)]]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.HELP_DESK.CONFIGURE.CATEGORY.CATEGORY_ABSOLUTE]); });
  }

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Help Desk', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Category', link: ROUTES.HELP_DESK.CONFIGURE.CATEGORY.CATEGORY_ABSOLUTE },
      { label: 'Add Category', link: '' },
    ];
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true,
    };

    this.department = {
      data: {
        data: this.departmentList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'department',
      formControlName: 'department',
      label: 'Department',
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
  };

  private OnSave(): void {
    this.submitted = true;
    if (this.addCategoryFormGroup.valid) {
      const data: ICategory = {
        name: this.f?.['name']?.value,
        departmentId: this.f?.['department']?.value,
        description: this.f?.['description']?.value,
      };
      this.loading = true;

      this.service.addCategory(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ICategoryObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.HELP_DESK.CONFIGURE.CATEGORY.CATEGORY_ABSOLUTE]);
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
