import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TextField, TextArea, Checkbox, Button, DropDown, DropdownValue, GlobalService, InputType, BaseResponseModel } from 'workspace-library';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { BreadcrumbItem } from '@models/common.model';
import { Subject, takeUntil } from 'rxjs';
import { ICategory, ICategoryObject } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add.sub.category',
  templateUrl: './add.sub.category.component.html',
  styleUrl: './add.sub.category.component.css'
})
export class AddSubCategoryComponent implements OnInit, OnDestroy {
  // #region class member
  addSubCategoryFormGroup!: FormGroup;
  name!: TextField;
  department!: DropDown;
  description!: TextArea;
  isApprovalRequired!: Checkbox;
  isSpecificDurationRequired!: Checkbox;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  subCategoryId: string = '';
  categoryId: string = '';
  departmentList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: CategoryService,
    private router: Router,
    private globalService: GlobalService,
    private uiService: UIService,
    private route: ActivatedRoute,
  ) {
    this.categoryId = this.route.snapshot.paramMap.get('id') ?? '';
    this.subCategoryId = this.route.snapshot.paramMap.get('subCategoryId') ?? '';
    if (Number(this.subCategoryId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addSubCategoryFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    if (this.isEdit) {
      this.getCategoryById(Number(this.subCategoryId));
    }
    else {
      this.getCategoryById(Number(this.categoryId));
    }
    this.setButtonConfig();
    this.getDepartmentItems();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  getCategoryById(id: number) {
    this.service.getCategoryById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ICategory>) => {
        if (res.isSuccess && res.data) {
          if (this.isEdit) {
            this.addSubCategoryFormGroup.setValue({
              name: res.data?.name || "",
              department: res.data?.departmentId || "",
              description: res.data?.description || "",
              isApprovalRequired: res.data?.isApprovalRequired,
              isSpecificDurationRequired: res.data?.isSpecificDurationRequired
            });
          }
          else {
            this.addSubCategoryFormGroup.setValue({
              ...this.addSubCategoryFormGroup.value,
              department: res.data?.departmentId || "",
            });
          }
        }
      }
    });
  }

  getDepartmentItems() {
    this.uiService.getDropdownOptions(this.service.getDepartments(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.departmentList = data;
        this.setTextBoxConfig();
      }
    });
  }
  private initializeForm(): void {
    this.addSubCategoryFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      department: ["", [Validators.required]],
      description: ["", [Validators.maxLength(1000)]],
      isApprovalRequired: [null],
      isSpecificDurationRequired: [null]
    });
    this.addSubCategoryFormGroup.controls['department'].disable();
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.HELP_DESK.CONFIGURE.CATEGORY.EDIT_CATEGORY_ABSOLUTE, this.categoryId]); });
  }

  private setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Sub Category' : 'Add Sub Category';
    this.breadcrumbItems = [
      { label: 'Help Desk', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Category', link: ROUTES.HELP_DESK.CONFIGURE.CATEGORY.CATEGORY_ABSOLUTE },
      { label: 'Edit Category', link: [ROUTES.HELP_DESK.CONFIGURE.CATEGORY.EDIT_CATEGORY_ABSOLUTE, this.categoryId].join('/') },
      { label: LABEL, link: '' },
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

    this.isApprovalRequired = {
      label: 'Is Approval Required?',
      formControlName: 'isApprovalRequired'
    };

    this.isSpecificDurationRequired = {
      label: 'Is Specific Duration Required?',
      formControlName: 'isSpecificDurationRequired'
    };
  };

  private OnSave(): void {
    this.submitted = true;
    if (this.addSubCategoryFormGroup.valid) {
      const data: ICategory = {
        name: this.f?.['name']?.value,
        parentHelpDeskCategoryId: Number(this.categoryId),
        departmentId: this.f?.['department']?.value,
        description: this.f?.['description']?.value,
        isApprovalRequired: this.f['isApprovalRequired'].value,
        isSpecificDurationRequired: this.f?.['isSpecificDurationRequired'].value
      };
      this.loading = true;

      if (this.isEdit) {
        this.service.updateCategory(Number(this.subCategoryId), data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
          next: (res: BaseResponseModel<ICategoryObject>) => {
            if (res.isSuccess) {
              this.loading = false;
              this.globalService.openSnackBar(res.message);
              this.router.navigate([ROUTES.HELP_DESK.CONFIGURE.CATEGORY.EDIT_CATEGORY_ABSOLUTE, this.categoryId]);
            }
          },
          error: () => {
            this.loading = false;
          }
        });
      }
      else {
        this.service.addCategory(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
          next: (res: BaseResponseModel<ICategoryObject>) => {
            if (res.isSuccess) {
              this.loading = false;
              this.globalService.openSnackBar(res.message);
              this.router.navigate([ROUTES.HELP_DESK.CONFIGURE.CATEGORY.EDIT_CATEGORY_ABSOLUTE, this.categoryId]);
            }
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    }
  }
  // #endregion
}
