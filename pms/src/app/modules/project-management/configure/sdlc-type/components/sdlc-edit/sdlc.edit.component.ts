import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DataGrid, DataGridActionButton, DataGridFieldDataType, DataGridFieldType, DataGridFullRowData, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { BaseResponseModel, BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { PermissionService } from '@services/permission.service';
import { UIService } from '@services/ui.service';
import { Pages } from '@constants/Enums';
import { Subject, takeUntil } from 'rxjs';
import { IAddSdlcType, ISdlcType, ISdlcWorkFlowStepList, ISdlcWorkFlowStepObject, ISdlcWorkFlowTypeList, ISdlcWorkFlowTypeObject, IWorkFlowStepSearchParams, IWorkFlowTypeSearchParams } from '../../models/sdlc.type';
import { SDLCTypeService } from '../../services/sdlc.type.service';

@Component({
  selector: 'app-sdlc-edit',
  templateUrl: './sdlc.edit.component.html',
  styleUrl: './sdlc.edit.component.css'
})

export class SdlcEditComponent implements OnInit, OnDestroy {
  // #region class members
  editSdlcTypeFormGroup!: FormGroup;
  name!: TextField;
  sdlcTypeId: string = '';
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  addWorkFlowStepButtonConfig!: Button;
  addWorkFlowTypeButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEditMode: boolean = false;
  sdlcWorkFlowStepLoading: boolean = false;
  sdlcWorkFlowTypeLoading: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];
  stepPagePermissions: PageAccessPermission;
  typePagePermissions: PageAccessPermission;
  initialSearchParams: any = {
    search: '',
    isActive: true,
  };
  sdlcWorkFlowStepSearchParam: IWorkFlowStepSearchParams = { ...this.initialSearchParams };
  sdlcWorkFlowTypeSearchParam: IWorkFlowTypeSearchParams = { ...this.initialSearchParams };
  backButtonRoute = ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.SDLC_TYPE_ABSOLUTE;
  sdlcWorkFlowStepGridConfig!: DataGrid<ISdlcWorkFlowStepObject>;
  sdlcWorkFlowTypeGridConfig!: DataGrid<ISdlcWorkFlowTypeObject>;
  sdlcWorkFlowStepList: ISdlcWorkFlowStepList | null = {} as ISdlcWorkFlowStepList;
  sdlcWorkFlowTypeList: ISdlcWorkFlowTypeList | null = {} as ISdlcWorkFlowTypeList;
  stepTableColumns: any[] = [
    { field: "color", title: "Flow Step Color", fieldDataType: DataGridFieldDataType.string, fieldType: DataGridFieldType.colorBox, customHeaderClassName: 'flowStep-col', isSortable: false },
    { field: "name", title: "Name", isSortable: false },
    { field: "isClosed", title: "Is Close?", fieldDataType: DataGridFieldDataType.string, fieldType: DataGridFieldType.iconBoolean, customHeaderClassName: 'isClose-col', trueIconImagePath: './assets/images/checkmark-gray.svg', falseIconImagePath: '', isSortable: false },
  ];
  typeTableColumns: any[] = [
    { field: "abbreviation", title: "Abbreviation", customHeaderClassName: 'abbreviation-col', isSortable: false },
    { field: "name", title: "Name", isSortable: false },
    { field: "isDefect", title: "Is Defect?", fieldDataType: DataGridFieldDataType.string, fieldType: DataGridFieldType.iconBoolean, customHeaderClassName: 'isClose-col', trueIconImagePath: './assets/images/checkmark-gray.svg', falseIconImagePath: '', isSortable: false },
  ];

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private sdlcTypeService: SDLCTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService,
    private permissionService: PermissionService,
  ) {
    this.sdlcTypeId = this.route.snapshot.paramMap.get('id') ?? '';
    this.stepPagePermissions = this.permissionService.checkAllPermission(Pages.ProjectWorkFlowStep);
    this.typePagePermissions = this.permissionService.checkAllPermission(Pages.ProjectWorkFlowType);
  }
  // #endregion

  get f() {
    return this.editSdlcTypeFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getProjectSdlcTypeById(Number(this.sdlcTypeId));
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
    this.setTableConfig();
    if (this.typePagePermissions.isViewPermission) {
      this.getSDLCWorkFlowTypeList();
    }
    if (this.stepPagePermissions.isViewPermission) {
      this.getSDLCWorkFlowStepList();
    }
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  enterEditMode() {
    this.isEditMode = true;
    this.editSdlcTypeFormGroup.controls['name'].enable();
  }

  backToManageSDLCType(): void {
    this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.SDLC_TYPE_ABSOLUTE]);
  }

  private getSDLCWorkFlowStepList() {
    this.sdlcWorkFlowStepLoading = true;
    const data = {
      ...this.sdlcWorkFlowStepSearchParam
    };

    this.sdlcTypeService.getWorkFlowStepBySdlcTypeId(Number(this.sdlcTypeId), data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISdlcWorkFlowStepList>) => {
          if (res.isSuccess) {
            if (res.data) {
              this.sdlcWorkFlowStepList = res.data;
              this.setTableConfig();
            }
          }
          setTimeout(() => {
            this.sdlcWorkFlowStepLoading = false;
          }, 300);
        },
        error: () => {
          this.sdlcWorkFlowStepLoading = false;
        }
      });
  }

  private getSDLCWorkFlowTypeList() {
    this.sdlcWorkFlowTypeLoading = true;
    const data = {
      ...this.sdlcWorkFlowTypeSearchParam
    };

    this.sdlcTypeService.getWorkFlowTypeBySdlcTypeId(Number(this.sdlcTypeId), data)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISdlcWorkFlowTypeList>) => {
          if (res.isSuccess) {
            if (res.data) {
              this.sdlcWorkFlowTypeList = res.data;
              this.setTableConfig();
            }
          }
          setTimeout(() => {
            this.sdlcWorkFlowTypeLoading = false;
          }, 300);
        },
        error: () => {
          this.sdlcWorkFlowTypeLoading = false;
        }
      });
  }

  private getProjectSdlcTypeById(id: number) {
    this.sdlcTypeService.getSdlcById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISdlcType>) => {
          if (res.isSuccess && res.data) {
            this.editSdlcTypeFormGroup.setValue({
              name: res.data?.name || "",
              status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            });
          }
        },
      });
  }

  private addSdlcWorkFlowStep(): void {
    this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, this.sdlcTypeId, 'sdlc-work-flow-step', 'add'],);
  }

  private addSdlcWorkFlowType(): void {
    this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, this.sdlcTypeId, 'sdlc-work-flow-type', 'add'],);
  }

  private cancelEdit() {
    this.isEditMode = false;
    this.getProjectSdlcTypeById(Number(this.sdlcTypeId));
    this.editSdlcTypeFormGroup.controls['name'].disable();
  }

  private initializeForm(): void {
    this.editSdlcTypeFormGroup = this.fb?.group({
      name: ["", [Validators.required]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE }],
    });
    this.editSdlcTypeFormGroup.controls['name'].disable();
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.cancelEdit(); });
    this.addWorkFlowStepButtonConfig = this.uiService.getAddButtonConfig(() => { this.addSdlcWorkFlowStep(); }, "Add Work Flow Step", "addSdlcWorkFlowStep");
    this.addWorkFlowTypeButtonConfig = this.uiService.getAddButtonConfig(() => { this.addSdlcWorkFlowType(); }, "Add Work Flow Type", "addSdlcWorkFlowType");
  }

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'SDLC Type', link: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.SDLC_TYPE_ABSOLUTE },
      { label: `Edit SDLC Type`, link: '' },
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
  };

  private setTableConfig(): void {
    if (this.typePagePermissions.isViewPermission) {
      this.sdlcWorkFlowTypeGridConfig = this.getWorkFlowTypeGridConfig();
    }
    if (this.stepPagePermissions.isViewPermission) {
      this.sdlcWorkFlowStepGridConfig = this.getWorkFlowStepGridConfig();
    }
  }

  private setStepTableColumns() {
    const columnData: any[] = [];
    this.stepTableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    columnData.push(
      {
        field: "displayOrder",
        title: "Display Order",
        fieldDataType: DataGridFieldDataType.icon,
        fieldType: DataGridFieldType.iconGroup,
        iconGroup: ['./assets/images/arrow-up-long.svg', './assets/images/arrow-down-long.svg'],
        customHeaderClassName: 'displayOrder-col',
        downCallBack: (element: any) => {
          if (element?.id) {
            this.updateDisplayOrderStep(Number(element.id), false);
          }
        },
        upCallBack: (element: any) => {
          if (element?.id) {
            this.updateDisplayOrderStep(Number(element.id), true);
          }
        }
      },
    );
    return columnData;
  }

  private setTypeTableColumns() {
    const columnData: any[] = [];
    this.typeTableColumns.forEach((cols) => {
      columnData.push(this.uiService.getColumnConfig(cols));
    });
    columnData.push(
      {
        field: "displayOrder",
        title: "Display Order",
        fieldDataType: DataGridFieldDataType.icon,
        fieldType: DataGridFieldType.iconGroup,
        customHeaderClassName: 'displayOrder-col',
        downCallBack: (element: any) => {
          if (element?.id) {
            this.updateDisplayOrderType(Number(element.id), false);
          }
        },
        upCallBack: (element: any) => {
          if (element?.id) {
            this.updateDisplayOrderType(Number(element.id), true);
          }
        }
      },
    );
    return columnData;
  }

  private getWorkFlowStepGridConfig = (): DataGrid<ISdlcWorkFlowStepObject> => {
    const config: DataGrid<ISdlcWorkFlowStepObject> = {
      actionButtons: this.getSdlcWorkFlowStepActionButtons(),
      columns: this.setStepTableColumns(),
      pageIndex: 1,
      totalDataLength: this.sdlcWorkFlowStepList?.totalRecords || 0,
      isNoRecordFound: !((this.sdlcWorkFlowStepList?.totalRecords ?? 0) > 0),
      gridData: {
        data: this.sdlcWorkFlowStepList?.records,
        dataSource: undefined
      },
      id: 'sdlcworkflowstep',
      idFieldKey: 'id',
      displayIndexNumber: false,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      },
    };
    return config;
  };

  private updateDisplayOrderStep = (id: number, moveUp: boolean): void => {
    this.sdlcTypeService.updateSdlcWorkFlowStepDisplayOrder(id, moveUp)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISdlcWorkFlowStepObject>) => {
          if (res.isSuccess) {
            this.globalService.openSnackBar(res?.message);
            this.getSDLCWorkFlowStepList();
          }
        },
        error: () => {
          this.sdlcWorkFlowStepLoading = false;
        }
      });
  };

  private updateDisplayOrderType = (id: number, moveUp: boolean): void => {
    this.sdlcTypeService.updateSdlcWorkFlowTypeDisplayOrder(id, moveUp)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISdlcWorkFlowTypeObject>) => {
          if (res.isSuccess) {
            this.globalService.openSnackBar(res?.message);
            this.getSDLCWorkFlowTypeList();
          }
        },
        error: () => {
          this.sdlcWorkFlowTypeLoading = false;
        }
      });
  };

  private getWorkFlowTypeGridConfig = (): DataGrid<ISdlcWorkFlowTypeObject> => {
    const config: DataGrid<ISdlcWorkFlowTypeObject> = {
      actionButtons: this.getSdlcWorkFlowTypeActionButtons(),
      columns: this.setTypeTableColumns(),
      pageIndex: 1,
      totalDataLength: this.sdlcWorkFlowTypeList?.totalRecords || 0,
      isNoRecordFound: !((this.sdlcWorkFlowTypeList?.totalRecords ?? 0) > 0),
      gridData: {
        data: this.sdlcWorkFlowTypeList?.records,
        dataSource: undefined
      },
      id: 'sdlcworkflowType',
      idFieldKey: 'id',
      displayIndexNumber: false,
      indexColumnHeaderName: 'No.',
      features: {
        hidePagination: true
      },
    };
    return config;
  };

  private getSdlcWorkFlowStepActionButtons(): DataGridActionButton<ISdlcWorkFlowStepObject>[] {
    const actionsButton = [];
    if (this.stepPagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<ISdlcWorkFlowStepObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ISdlcWorkFlowStepObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, this.sdlcTypeId, 'sdlc-work-flow-step', 'edit', data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    if (this.stepPagePermissions.isEditPermission) {
      const deleteButton: DataGridActionButton<ISdlcWorkFlowStepObject> = this.uiService.getDeleteActionButtonConfig((data: DataGridFullRowData<ISdlcWorkFlowStepObject>) => {
        if (data?.rowData?.id) {
          this.deleteSdlcWorkFlowStepConfirmation(Number(data.rowData.id));
        }
      });
      actionsButton.push(deleteButton);
    }
    return actionsButton;
  }

  private getSdlcWorkFlowTypeActionButtons(): DataGridActionButton<ISdlcWorkFlowTypeObject>[] {
    const actionsButton = [];
    if (this.typePagePermissions.isEditPermission) {
      const editButton: DataGridActionButton<ISdlcWorkFlowTypeObject> = this.uiService.getEditActionButtonConfig((data: DataGridFullRowData<ISdlcWorkFlowTypeObject>) => {
        if (data?.rowData?.id) {
          this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, this.sdlcTypeId, 'sdlc-work-flow-type', 'edit', data.rowData.id]);
        }
      });
      actionsButton.push(editButton);
    }
    if (this.typePagePermissions.isDeletePermission) {
      const deleteButton: DataGridActionButton<ISdlcWorkFlowTypeObject> = this.uiService.getDeleteActionButtonConfig((data: DataGridFullRowData<ISdlcWorkFlowTypeObject>) => {
        if (data?.rowData?.id) {
          this.deleteSdlcWorkFlowTypeConfirmation(Number(data.rowData.id));
        }
      });
      actionsButton.push(deleteButton);
    }
    return actionsButton;
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.editSdlcTypeFormGroup.valid) {
      const data: IAddSdlcType = {
        name: this.f?.['name']?.value,
        isActive: this.f?.['status']?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
      };
      this.loading = true;
      this.sdlcTypeService.updateSdlcType(Number(this.sdlcTypeId), data)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: BaseResponseModel<ISdlcType>) => {
            if (res.isSuccess) {
              this.loading = false;
              this.globalService.openSnackBar(res.message);
              this.isEditMode = false;
              this.editSdlcTypeFormGroup.controls['name'].disable();
            }
          },
          error: () => {
            this.loading = false;
          }
        });
    }
  }

  private deleteSdlcWorkFlowStep(id: number): void {
    this.sdlcTypeService.deleteSdlcWorkFlowStep(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response: BaseResponseModel<ISdlcWorkFlowStepObject>) => {
          if (response.isSuccess) {
            this.globalService.openSnackBar(response?.message);
            this.getSDLCWorkFlowStepList();
          }
        },
      });
  }

  private deleteSdlcWorkFlowStepConfirmation(id: number): void {
    this.uiService.openDeleteModel(() => { this.deleteSdlcWorkFlowStep(id); });
  }

  private deleteSdlcWorkFlowType(id: number): void {
    this.sdlcTypeService.deleteSdlcWorkFlowType(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (response: BaseResponseModel<ISdlcWorkFlowTypeObject>) => {
          if (response.isSuccess) {
            this.globalService.openSnackBar(response?.message);
            this.getSDLCWorkFlowTypeList();
          }
        },
      });
  }

  private deleteSdlcWorkFlowTypeConfirmation(id: number): void {
    this.uiService.openDeleteModel(() => { this.deleteSdlcWorkFlowType(id); });
  }
  // #endregion
}
