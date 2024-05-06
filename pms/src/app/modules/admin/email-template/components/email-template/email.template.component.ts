import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Button, DataGrid, DataGridActionButton, DataGridFullRowData, DropDown, InputType, TextField } from 'workspace-library';
import { Router } from '@angular/router';
import { ACTIVE_INACTIVE_STATUS_LABEL, DEFAULT_ORDER, DEFAULT_PAGINATION, GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { PermissionService } from '@services/permission.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IEmailTemplateList, IEmailTemplateObject, IEmailTemplateSearchParams } from '../../models/email.template';
import { EmailTemplateService } from '../../services/email.template.service';

@Component({
    selector: 'app-email-template',
    templateUrl: './email.template.component.html',
    styleUrl: './email.template.component.css'
})

export class EmailTemplateComponent implements OnInit, OnDestroy {
    // #region initialize variables
    filterForm!: FormGroup;
    searchName!: TextField;
    status !: DropDown;
    searchBtnConfig !: Button;
    resetBtnConfig !: Button;
    isGridLoading: boolean = true;
    initialSearchParams: IEmailTemplateSearchParams = {
        ...DEFAULT_PAGINATION,
        search: '',
        isActive: true,
        sortBy: 'Name'
    };
    emailTemplateSearchParams: IEmailTemplateSearchParams = { ...this.initialSearchParams };
    emailTemplateList: IEmailTemplateList | null = {} as IEmailTemplateList;
    emailTemplateGridConfig!: DataGrid<IEmailTemplateObject>;
    breadcrumbItems: BreadcrumbItem[] = [];
    pagePermissions: PageAccessPermission;
    resetSorting: boolean = false;
    tableColumns: any[] = [
        { field: "name", title: "Name", customHeaderClassName: 'name-column', },
        { field: "subject", title: "Subject", customHeaderClassName: 'subject-column', }
    ];
    private ngUnsubscribe$ = new Subject<void>();
    // #endregion

    // #region constructor
    constructor(
        private fb: FormBuilder,
        private service: EmailTemplateService,
        private uiService: UIService,
        private router: Router,
        private permissionService: PermissionService
    ) {
        this.pagePermissions = this.permissionService.checkAllPermission(Pages.EmailTemplate);
    }
    // #endregion

    ngOnInit() {
        this.initializeForm();
        this.setTextBoxConfig();
        this.setTableConfig();
        this.setButtonConfig();
        this.getEmailTemplateList();
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
            { label: 'Email Template', link: '' }
        ];
    }

    private initializeForm(): void {
        this.filterForm = this.fb?.group({
            searchName: [""],
            status: [ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE]
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
        this.status = this.uiService.getStatusFieldConfig(() => { this.applyFilter(); });
    };

    private setButtonConfig(): void {
        this.resetSorting = false;
        this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
        this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
    }

    private resetFilter(): void {
        this.resetSorting = true;
        this.filterForm.patchValue({
            searchName: '',
            status: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
        });
        this.emailTemplateSearchParams = {
            ...this.initialSearchParams,
            pageSize: this.uiService.getPageSize() ?? this.initialSearchParams.pageSize,
            sortDirection: GLOBAL_CONSTANTS.ASCENDING
        };
        this.getEmailTemplateList();
    }

    private applyFilter(): void {
        this.resetSorting = true;
        this.filterForm.patchValue({ searchName: this.filterForm.get('searchName')?.value.trim() });
        this.emailTemplateSearchParams = {
            ...this.initialSearchParams,
            pageSize: DEFAULT_PAGINATION.pageSize,
            pageNumber: DEFAULT_PAGINATION.pageNumber,
            search: this.filterForm.get('searchName')?.value,
            isActive: this.filterForm.get('status')?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
        };
        this.getEmailTemplateList();
    }

    private setTableConfig(): void {
        this.emailTemplateGridConfig = this.getGridConfig();
    }

    private setTableColumns() {
        const columnData: any[] = [];
        this.tableColumns.forEach((cols) => {
            columnData.push(this.uiService.getColumnConfig(cols));
        });
        return columnData;
    }

    private getGridConfig = (): DataGrid<IEmailTemplateObject> => {
        const config: DataGrid<IEmailTemplateObject> = {
            actionButtons: this.getActionButtons(),
            columns: this.setTableColumns(),
            pageIndex: this.emailTemplateSearchParams.pageNumber - 1,
            defaultPageSize: this.uiService.getPageSize() ?? this.emailTemplateSearchParams.pageSize,
            totalDataLength: this.emailTemplateList?.totalRecords || 0,
            isNoRecordFound: !((this.emailTemplateList?.totalRecords ?? 0) > 0),
            paginationCallBack: (event) => {
                this.emailTemplateSearchParams = {
                    ...this.emailTemplateSearchParams,
                    pageNumber: (event?.pageIndex ?? 0) + 1,
                    pageSize: event?.pageSize
                };
                this.uiService.setPageSize(event?.pageSize);
                this.getEmailTemplateList();
            },
            gridData: {
                data: this.emailTemplateList?.records,
                dataSource: undefined
            },
            id: 'EmailTemplateGrid',
            idFieldKey: 'id',
            displayIndexNumber: true,
            indexColumnHeaderName: 'No.',
            features: {
                hidePagination: false
            },
            gridFilter: {
                order: { dir: DEFAULT_ORDER, sortColumn: 'name' },
                pageNumber: this.emailTemplateSearchParams.pageNumber,
                pageSize: this.emailTemplateSearchParams.pageSize
            },
            getSortOrderAndColumn: (event) => {
                if (event && event?.sortColumn && event?.sortDirection) {
                    this.emailTemplateSearchParams = {
                        ...this.emailTemplateSearchParams,
                        sortBy: event?.sortColumn,
                        pageNumber: 1,
                        sortDirection: event?.sortDirection
                    };

                    this.getEmailTemplateList();
                }
            }
        };
        return config;
    };

    private getActionButtons(): DataGridActionButton<IEmailTemplateObject>[] {
        const actionsButton = [];
        if (this.pagePermissions.isEditPermission) {
            const editButton: DataGridActionButton<IEmailTemplateObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<IEmailTemplateObject>) => {
                if (data?.rowData?.id) {
                    this.router.navigate([ROUTES.ADMIN.EMAIL_TEMPLATE.EDIT_EMAIL_TEMPLATE_ABSOLUTE, data.rowData.id]);
                }
            });
            actionsButton.push(editButton);
        }
        const previewButton: DataGridActionButton<IEmailTemplateObject> = this.uiService.getPreviewActionButtonConfig((data: DataGridFullRowData<IEmailTemplateObject>) => {
            if (data?.rowData?.id) {
                this.router.navigate([ROUTES.ADMIN.EMAIL_TEMPLATE.PREVIEW_EMAIL_TEMPLATE_ABSOLUTE, data.rowData.id]);
            }
        });
        actionsButton.push(previewButton);
        return actionsButton;
    }

    private getEmailTemplateList() {
        this.isGridLoading = true;
        const data = {
            ...this.emailTemplateSearchParams
        };

        this.service.getEmailTemplates(data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
            next: (res: BaseResponseModel<IEmailTemplateList>) => {
                if (res.isSuccess) {
                    if (res.data) {
                        this.emailTemplateList = res.data;
                        this.setTableConfig();
                    }
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
