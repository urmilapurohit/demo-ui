import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { TextField, DropDown, Button, DataGrid, DropdownValue, GlobalService, InputType, DataGridActionButton, DataGridFullRowData, BaseResponseModel } from 'workspace-library';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IDocumentList, IDocumentObject, IDocumentSearchParams } from '../../models/document';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrl: './document.component.css'
})
export class DocumentComponent implements OnInit, OnDestroy {
  // #region initialize variables
  name!: TextField;
  documentCategory!: DropDown;
  status!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  initialSearchParams: IDocumentSearchParams = {
    ...DEFAULT_PAGINATION,
    name: '',
    documentCategoryId: 0,
    isActive: true,
    sortBy: 'Name'
  };
  documentGridConfig!: DataGrid<IDocumentObject>;
  documentList: IDocumentList | null = {} as IDocumentList;
  documentSearchParams: IDocumentSearchParams = { ...this.initialSearchParams };
  filterForm!: FormGroup;
  isGridLoading: boolean = true;
  pagePermissions: PageAccessPermission;
  resetSorting: boolean = false;
  documentCategoryList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  tableColumns: any[] = [
    { field: "documentCategoryName", title: "Category", customHeaderClassName: 'doc-category-column' },
    { field: "title", title: "Title", customHeaderClassName: 'doc-title-column' },
    { field: "documentFileName", title: "Document Name", customHeaderClassName: 'doc-name-column' },
    { field: "displayOrder", title: "Display Order", customHeaderClassName: 'doc-displayorder-column' }
  ];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: DocumentService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private router: Router,
    private uiService: UIService,
    private permissionService: PermissionService
  ) {
    this.documentSearchParams = {
      ...this.documentSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.documentSearchParams.pageSize
    };
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.Document);
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setButtonConfig();
    this.setTextBoxConfig();
    this.getDocumentCategoryList();
    this.setTableConfig();
    this.getDocumentList();
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
      { label: 'Document', link: '' },
    ];
  }

  addDocument(): void {
    this.router.navigate([ROUTES.ADMIN.DOCUMENT.ADD_DOCUMENT_ABSOLUTE]);
  }

  private getDocumentCategoryList() {
    this.uiService.getDropdownOptions(this.service.getDocumentCategories(), true, { id: 0, text: 'All' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.documentCategoryList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      name: [""],
      documentCategory: 0,
      status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE]
    });
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Title',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.documentCategory = {
      data: {
        data: this.documentCategoryList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'documentCategory',
      formControlName: 'documentCategory',
      label: 'document Category',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
    this.status = this.uiService.getStatusFieldConfig(() => { this.applyFilter(); });
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private setTableConfig(): void {
    this.resetSorting = false;
    this.documentGridConfig = this.getGridConfig();
  }

  private setTableColumns() {
    const columnData: any[] = [];
    this.tableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    return columnData;
  }

  private getGridConfig = (): DataGrid<IDocumentObject> => {
    const config: DataGrid<IDocumentObject> = {
      actionButtons: this.getActionButtons(),
      columns: this.setTableColumns(),
      pageIndex: this.documentSearchParams.pageNumber - 1,
      defaultPageSize: this.uiService.getPageSize() ?? this.documentSearchParams.pageSize,
      totalDataLength: this.documentList?.totalRecords || 0,
      isNoRecordFound: !((this.documentList?.totalRecords ?? 0) > 0),
      paginationCallBack: (event) => {
        this.documentSearchParams = {
          ...this.documentSearchParams,
          pageNumber: (event?.pageIndex ?? 0) + 1,
          pageSize: event?.pageSize
        };
        this.uiService.setPageSize(event?.pageSize);
        this.getDocumentList();
      },
      gridData: {
        data: this.documentList?.records,
        dataSource: undefined
      },
      id: 'DocumentGrid',
      idFieldKey: 'id',
      displayIndexNumber: true,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: false
      },
      gridFilter: {
        order: { dir: DEFAULT_ORDER, sortColumn: 'title' },
        pageNumber: this.documentSearchParams.pageNumber,
        pageSize: this.documentSearchParams.pageSize
      },
      getSortOrderAndColumn: (event) => {
        if (event && event?.sortColumn && event?.sortDirection) {
          this.documentSearchParams = {
            ...this.documentSearchParams,
            sortBy: event?.sortColumn,
            pageNumber: 1,
            sortDirection: event?.sortDirection
          };

          this.getDocumentList();
        }
      }
    };
    return config;
  };

  private getActionButtons(): DataGridActionButton<IDocumentObject>[] {
    const actionsButton = [];
    if (this.pagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<IDocumentObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IDocumentObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.ADMIN.DOCUMENT.EDIT_DOCUMENT_ABSOLUTE, data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
      const statusButton = this.uiService.getStatusActionButtonConfig((data: DataGridFullRowData<IDocumentObject>) => {
        if (data?.rowData?.id) {
          this.updateStatusConfirmation(Number(data.rowData.id), data.rowData.isActive);
        }
      });
      actionsButton.push(statusButton);
    }
    return actionsButton;
  }

  private applyFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({ name: this.filterForm.get('name')?.value.trim() });
    this.documentSearchParams = {
      ...this.initialSearchParams,
      pageSize: DEFAULT_PAGINATION.pageSize,
      pageNumber: DEFAULT_PAGINATION.pageNumber,
      name: this.filterForm.get('name')?.value,
      documentCategoryId: this.filterForm.get('documentCategory')?.value,
      isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    };
    this.getDocumentList();
  }

  private getDocumentList() {
    this.isGridLoading = true;
    const data = {
      ...this.documentSearchParams
    };

    this.service.getDocuments(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IDocumentList>) => {
        if (res.isSuccess && res.data) {
          this.documentList = res.data;
          this.setTableConfig();
        }
        this.isGridLoading = false;
      },
      error: () => {
        this.isGridLoading = false;
      }
    });
  }

  private resetFilter(): void {
    this.resetSorting = true;
    this.filterForm.patchValue({
      name: '',
      documentCategory: 0,
      status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
    });
    this.documentSearchParams = {
      ...this.initialSearchParams,
      pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
      sortDirection: GLOBAL_CONSTANTS.ASCENDING
    };
    this.getDocumentList();
  }

  private setPagination() {
    this.documentSearchParams = this.uiService.adjustPagination(this.documentList, this.documentSearchParams);
  }

  private changeStatus(documentId: number, isActive: boolean): void {
    this.service.updateStatus(documentId, !isActive).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (response: BaseResponseModel<IDocumentObject>) => {
        if (response.isSuccess) {
          this.globalService.openSnackBar(response?.message);
          this.setPagination();
          this.getDocumentList();
        }
      }
    });
  }

  private updateStatusConfirmation(documentId: number, isActive: boolean): void {
    this.uiService.openStatusChangeModel(() => { this.changeStatus(documentId, isActive); });
  }
  // #endregion
}
