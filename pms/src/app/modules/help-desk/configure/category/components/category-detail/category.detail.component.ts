import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TextField, TextArea, DropDown, Button, DataGrid, GlobalService, InputType, DataGridActionButton, DataGridFullRowData, BaseResponseModel, DropdownValue } from 'workspace-library';
import { Pages } from '@constants/Enums';
import { DEFAULT_PAGINATION } from '@constants/constant';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { ICategorySearchParams, ICategory, ICategoryObject, ICategoryList } from '../../models/category';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-category.detail',
  templateUrl: './category.detail.component.html',
  styleUrl: './category.detail.component.css'
})
export class CategoryDetailComponent implements OnInit, OnDestroy {
  // #region class member
  public contentLoaded: boolean = false;
  editCategoryFormGroup!: FormGroup;
  name!: TextField;
  description!: TextArea;
  department!: DropDown;
  categoryId: string = '';
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  addSubCategoryButtonConfig!: Button;
  initialSearchParams: ICategorySearchParams = {
    ...DEFAULT_PAGINATION,
    departmentId: 0,
    categoryId: 0,
    sortBy: 'Name'
  };
  submitted: boolean = false;
  loading: boolean = false;
  isGridLoading: boolean = true;
  isEditMode: boolean = false;
  departmentList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  subcategorySearchParam: ICategorySearchParams = { ...this.initialSearchParams };
  subCategoryGridConfig!: DataGrid<ICategoryObject>;
  subCategoryList!: ICategoryList | null;
  tableColumns: any[] = [
    { field: "name", title: "Name", isSortable: false }
  ];
  pagePermissions: PageAccessPermission;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: CategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService,
    private permissionService: PermissionService,
  ) {
    this.categoryId = this.route.snapshot.paramMap.get('id') ?? '';
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.HelpDeskCategory);
  }
  // #endregion

  get f() {
    return this.editCategoryFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getCategoryById(Number(this.categoryId));
    this.getDepartmentList();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
    this.setTableConfig();
    this.getSubCategoryList();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods

  backToCategoryGrid(): void {
    this.router.navigate([ROUTES.HELP_DESK.CONFIGURE.CATEGORY.CATEGORY_ABSOLUTE]);
  }

  getDepartmentList() {
    this.uiService.getDropdownOptions(this.service.getDepartments(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.departmentList = data;
        this.setTextBoxConfig();
      }
    });
  }

  addSubCategory(): void {
    this.router.navigate([ROUTES.HELP_DESK.CONFIGURE.CATEGORY.EDIT_CATEGORY_ABSOLUTE, this.categoryId, 'sub-category', 'add'],);
  }

  getCategoryById(id: number) {
    this.service.getCategoryById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ICategory>) => {
        if (res.isSuccess && res.data) {
          this.editCategoryFormGroup.setValue({
            name: res.data?.name || "",
            department: res.data?.departmentId || "",
            description: res.data?.description || ""
          });
        }
      }
    });
  }

  enterEditMode() {
    this.isEditMode = true;
    this.editCategoryFormGroup.controls['name'].enable();
    this.editCategoryFormGroup.controls['department'].enable();
    this.editCategoryFormGroup.controls['description'].enable();
  }

  cancelEdit() {
    this.isEditMode = false;
    this.getCategoryById(Number(this.categoryId));
    this.editCategoryFormGroup.controls['name'].disable();
    this.editCategoryFormGroup.controls['department'].disable();
    this.editCategoryFormGroup.controls['description'].disable();
  }

  private initializeForm(): void {
    this.editCategoryFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      department: ["", [Validators.required]],
      description: ["", [Validators.maxLength(1000)]]
    });
    this.editCategoryFormGroup.controls['name'].disable();
    this.editCategoryFormGroup.controls['department'].disable();
    this.editCategoryFormGroup.controls['description'].disable();
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.cancelEdit(); });
    this.addSubCategoryButtonConfig = this.uiService.getAddButtonConfig(() => { this.addSubCategory(); }, "Add Sub Category", "addSubCategory");
  }

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Help Desk', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Category', link: ROUTES.HELP_DESK.CONFIGURE.CATEGORY.CATEGORY_ABSOLUTE },
      { label: 'Edit Category', link: '' }
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

  private getActionButtons(): DataGridActionButton<ICategoryObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<ICategoryObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ICategoryObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.HELP_DESK.CONFIGURE.CATEGORY.EDIT_CATEGORY_ABSOLUTE, this.categoryId, 'sub-category', 'edit', data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    if (this.pagePermissions.isDeletePermission) {
      const deleteButton: DataGridActionButton<ICategoryObject> = this.uiService.getDeleteActionButtonConfig((data: DataGridFullRowData<ICategoryObject>) => {
        if (data?.rowData?.id) {
          this.deleteSubCategoryRequest(Number(data.rowData.id));
        }
      });
      actionsButton.push(deleteButton);
    }
    return actionsButton;
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.editCategoryFormGroup.valid) {
      const data: ICategory = {
        name: this.f?.['name']?.value,
        parentHelpDeskCategoryId: null,
        departmentId: this.f?.['department']?.value,
        description: this.f?.['description']?.value
      };
      this.loading = true;
      this.service.updateCategory(Number(this.categoryId), data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ICategoryObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.getCategoryById(Number(this.categoryId));
            this.isEditMode = false;
            this.editCategoryFormGroup.controls['name'].disable();
            this.editCategoryFormGroup.controls['department'].disable();
            this.editCategoryFormGroup.controls['description'].disable();
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  private setTableConfig(): void {
    this.subCategoryGridConfig = this.getSubCategoryGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getSubCategoryGridConfig = (): DataGrid<ICategoryObject> => {
    const config: DataGrid<ICategoryObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.subcategorySearchParam.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.subcategorySearchParam.pageSize,
      isNoRecordFound: !((this.subCategoryList?.totalRecords ?? 0) > 0),
      gridData: {
        data: this.subCategoryList?.records,
        dataSource: undefined
      },
      id: 'SubCategoryId',
      idFieldKey: 'id',
      displayIndexNumber: false,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      }
    };
    return config;
  };

  private deleteSubCategory(id: number): void {
    this.service.deleteCategory(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<ICategoryObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.getSubCategoryList();
        }
      }
    });
  }

  private deleteSubCategoryRequest(id: number): void {
    this.uiService.openDeleteModel(() => { this.deleteSubCategory(id); });
  }

  private getSubCategoryList() {
    this.isGridLoading = true;
    this.service.getSubCategory(Number(this.categoryId)).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ICategoryList>) => {
        if (res.isSuccess && res.data) {
          this.subCategoryList = res.data;
          this.setTableConfig();
        }
        setTimeout(() => {
          this.isGridLoading = false;
        }, 300);
      },
      error: () => {
        this.isGridLoading = false;
      }
    });
  }
  // #endregion
}
