import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { BaseResponseModel, Button, DataGrid, DataGridActionButton, DataGridFullRowData, GlobalService, InputType, TextField } from 'workspace-library';
import { Router } from '@angular/router';
import { DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IDocumentCategoryList, IDocumentCategoryObject, IDocumentCategorySearchParams } from '../../models/document.category';
import { DocumentCategoryService } from '../../services/document.category.service';

@Component({
  selector: 'app-document-category',
  templateUrl: './document.category.component.html',
  styleUrl: './document.category.component.css'
})

export class DocumentCategoryComponent implements OnInit, OnDestroy {
  // #region initialize variables
  searchName!: TextField;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IDocumentCategorySearchParams = {
    ...DEFAULT_PAGINATION,
    search: '',
    sortBy: 'Name'
  };
  documentCategoryGridConfig!: DataGrid<IDocumentCategoryObject>;
  documentCategoryList: IDocumentCategoryList | null = {} as IDocumentCategoryList;
  documentCategorySearchParams: IDocumentCategorySearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  tableColumns: any[] = [
    { field: "name", title: "Name", customHeaderClassName: "name-column" },
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: DocumentCategoryService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.documentCategorySearchParams = {
      ...this.documentCategorySearchParams,
      pageSize: this.uiService.getPageSize() ?? this.documentCategorySearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.DocumentCategory);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setTableConfig();
    this.getDocumentCategoryList();
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
      { label: 'Document Category', link: '' }
    ];
  }

  addDocumentCategory(): void {
    this.router.navigate([ROUTES.ADMIN.DOCUMENT_CATEGORY.ADD_DOCUMENT_CATEGORY_ABSOLUTE]);
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      searchName: [""]
    });
  }

  private setTextBoxConfig = (): void => {
    this.searchName = {
      label: 'Name',
      formControlName: 'searchName',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      searchName: ''
    });
    this.documentCategorySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getDocumentCategoryList();
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
    this.documentCategorySearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      search: this.filterForm.get('searchName')?.value
    };
    this.getDocumentCategoryList();
  }

  private getDocumentCategoryList() {
    this.isGridLoading = true;
    const data = {
      ...this.documentCategorySearchParams
    };

    this.service.getDocumentCategory(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IDocumentCategoryList>) => {
        if (res.isSuccess && res.data) {
          this.documentCategoryList = res.data;
          this.setTableConfig();
        }
        this.isGridLoading = false;
      },
      error: () => {
        this.isGridLoading = false;
      }
    });
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.documentCategoryGridConfig = this.getGridConfig();
  }

  private getGridConfig = (): DataGrid<IDocumentCategoryObject> => {
    const config: DataGrid<IDocumentCategoryObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.documentCategorySearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.documentCategorySearchParams.pageSize,
      totalDataLength: this.documentCategoryList?.totalRecords || 0,
      isNoRecordFound: !((this.documentCategoryList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.documentCategorySearchParams = {
          ...this.documentCategorySearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getDocumentCategoryList();
      },
      gridData: {
        data: this.documentCategoryList?.records,
        dataSource: undefined
      },
      id: 'DocumentCategoryGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: 'asc', sortColumn: 'name' },
        pageNumber: this.documentCategorySearchParams.pageNumber,
        pageSize: this.documentCategorySearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.documentCategorySearchParams = {
            ...this.documentCategorySearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getDocumentCategoryList();
        }
      }
    };
    return config;
  };

  private deleteDocumentCategoryRequest(documentCategoryId: number): void {
    this.uiService.openDeleteConfirmationModal(
      "Are you sure want to delete this document category?",
      () => {
        this.delete(documentCategoryId);
      }
    );
  }

  private delete(documentCategoryId: number): void {
    this.service.deleteDocumentCategory(documentCategoryId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IDocumentCategoryObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getDocumentCategoryList();
        }
      }
    });
  }

  private setPagination() {
    this.documentCategorySearchParams = this.uiService.adjustPagination(this.documentCategoryList, this.documentCategorySearchParams);
  }

  private getActionButtons(): DataGridActionButton<IDocumentCategoryObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IDocumentCategoryObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IDocumentCategoryObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.DOCUMENT_CATEGORY.EDIT_DOCUMENT_CATEGORY_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    if (this.pagePermissions.isDeletePermission) {
      const deleteButton = this.uiService.getDeleteActionButtonConfig((data: DataGridFullRowData<IDocumentCategoryObject>) => {
        if (data?.rowData?.id) {
          this.deleteDocumentCategoryRequest(Number(data.rowData.id));
        }
      });
      actionsButton.push(deleteButton);
    }
    return actionsButton;
  }
  // #endregion
}
