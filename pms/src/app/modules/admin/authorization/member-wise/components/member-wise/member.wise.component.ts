/* eslint-disable no-plusplus */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { DropDown, Button, DropdownValue, DataGrid, GlobalService, DataGridFieldDataType, DataGridFieldType, BaseResponseModel, DataGridColumn } from 'workspace-library';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { BreadcrumbItem, PageAccessPermission } from '@models/common.model';
import { PermissionService } from '@services/permission.service';
import { UIService } from '@services/ui.service';
import { Pages } from '@constants/Enums';
import { GeneralService } from '@services/general.service';
import { Subject, takeUntil } from 'rxjs';
import { IPageAccessRequestList, IPageRightsObject, IPageRightsSaveModel, IPermission } from '../../models/memberwise.model';
import { MemberWiseService } from '../../services/memberwise.service';

@Component({
  selector: 'app-member-wise',
  templateUrl: './member.wise.component.html',
  styleUrl: './member.wise.component.css'
})
export class MemberWiseComponent implements OnInit, OnDestroy {
  // #region class members
  memberDropdownConfig!: DropDown;
  moduleDropdownConfig!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  saveBtnConfig!: Button;
  filterForm!: FormGroup;
  headerForm!: FormGroup;
  memberOptions: DropdownValue[] = [];
  moduleOptions: DropdownValue[] = [];
  pageRightsGridConfig!: DataGrid<IPageRightsObject>;
  pageRightsGridData: IPageRightsObject[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];
  isGridLoading: boolean = false;
  memberId!: number;
  pagePermissions: PageAccessPermission;
  submitted = false;
  permissionList: IPermission[] = [];
  viewPermission!: IPermission;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: MemberWiseService,
    private fb: FormBuilder,
    private globalService: GlobalService,
    private uiService: UIService,
    private permissionService: PermissionService,
    private generalService: GeneralService,
  ) {
    this.pagePermissions = this.permissionService.checkAllPermission(Pages.AuthorizationByMember);
  }
  // #endregion

  ngOnInit() {
    this.getPermissionList();
    this.initializeForm();
    this.setDropDownConfig();
    this.getMembers();
    this.getModules();
    this.setButtonConfig();
    this.setBreadcrumb();
    this.setTableConfig();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Authorize', link: '' },
      { label: 'Member Wise', link: '' }
    ];
  }

  setHeaderFormControl = () => {
    this.permissionList.forEach((x) => {
      this.headerForm.addControl(
        `${x.name}_Header`,
        new FormControl({ value: false, disabled: false })
      );
    });
    this.headerForm.addControl(`All_Header`, new FormControl({ value: false, disabled: false }));
  };

  removeAllControlsExcept(controlsToKeep: string[]) {
    // eslint-disable-next-line no-restricted-syntax
    for (const controlName in this.headerForm.controls) {
      if (this.headerForm.controls[`${controlName}`]) {
        if (!controlsToKeep.includes(controlName)) {
          this.headerForm.removeControl(controlName);
        }
      }
    }
  }

  // Create form controls for check-boxs
  bindControls(): void {
    this.headerForm.enable();
    this.removeAllControlsExcept([...this.permissionList.map((x) => `${x.name}_Header`), 'All_Header']);
    this.pageRightsGridData.forEach((element) => {
      element.pageAccessTypeResponse?.forEach((permission) => {
        const permissionType = this.permissionList.find((x) => x.id === permission.pageAccessTypeId);
        // add control if permission exists
        if (permissionType) {
          this.headerForm.addControl(
            `${permissionType.name}_PageRight_${element.id}`,
            new FormControl({ value: permission.isAllowedAccessPage, disabled: !!permission.designationId })
          );
        }
      });

      if (element.pageAccessTypeResponse && element.pageAccessTypeResponse.length) {
        const checkedPermissionCount = element.pageAccessTypeResponse.filter((x) => x.isAllowedAccessPage === true)?.length;
        const disabledPermissionCount = element.pageAccessTypeResponse.filter((x) => x.designationId && x.designationId > 0)?.length;
        // set all check box of row true or false based on permission data
        this.headerForm.addControl(
          `All_PageRight_${element.id}`,
          new FormControl({ value: checkedPermissionCount === element.pageAccessTypeResponse.length, disabled: disabledPermissionCount === element.pageAccessTypeResponse.length })
        );
      }
    });
    this.setHeaderCheckBox();
  }

  // Common method for header checkbox changes
  onCanChangeHeader = (
    data: MatCheckboxChange,
    formControlName: string | undefined
  ): void => {
    // if All Header is checked reflect the change in all the checkboxs
    if (formControlName === 'All_Header') {
      this.pageRightsGridData?.forEach((record) => {
        record.pageAccessTypeResponse.forEach((permission) => {
          this.getFormControlPageAccessWiseAndPatchValue(permission.pageAccessTypeId, data.checked, record.id.toString());
          const allControl = this.headerForm.get(`All_PageRight_${record.id}`);
          if (allControl && !allControl.disabled) allControl.patchValue(data.checked);
        });
      });
      this.permissionList.forEach((x) => {
        const control = this.headerForm.get(`${x.name}_Header`);
        if (control && !control.disabled) {
          control.patchValue(data.checked);
        }
      });
      const allControl = this.headerForm.get(`All_Header`);
      if (allControl && !allControl.disabled) allControl.patchValue(data.checked);
    }
    // if View header is checked true check all view box and if view check box is unchecked remove all the permission after view
    else if (formControlName?.includes('View')) {
      this.pageRightsGridData?.forEach((record) => {
        if (record.pageAccessTypeResponse && record.pageAccessTypeResponse.length > 0) {
          if (data.checked && this.viewPermission) {
            record.pageAccessTypeResponse.forEach((permission) => {
              if (permission.pageAccessTypeId === this.viewPermission.id) {
                this.getFormControlPageAccessWiseAndPatchValue(this.viewPermission.id, data.checked, record.id.toString());
              }
            });
          }
          else {
            record.pageAccessTypeResponse.forEach((permission) => {
              this.getFormControlPageAccessWiseAndPatchValue(permission.pageAccessTypeId, data.checked, record.id.toString());
            });
          }
          this.setHeaderCheckBox();
          this.setAllCheckbox(record.id.toString(), data.checked);
        }
      });
    }
    // For permission other than all and view , where if checked to true the view checkbox in that row will also be checked &
    // if checked false only the permission related checkbox will be unchecked
    else {
      this.pageRightsGridData?.forEach((record) => {
        const checkPermissionType = this.permissionList.find((x) => formControlName?.includes(x.name));
        const filteredRecord = record.pageAccessTypeResponse.find((x) => x.pageAccessTypeId === checkPermissionType?.id);
        if (filteredRecord && checkPermissionType) {
          if (this.viewPermission && data.checked) {
            this.getFormControlPageAccessWiseAndPatchValue(this.viewPermission.id, data.checked, record.id.toString());
          }
          this.getFormControlPageAccessWiseAndPatchValue(checkPermissionType.id, data.checked, record.id.toString());
          this.setHeaderCheckBox();
          this.setAllCheckbox(record.id.toString(), data.checked);
        }
      });
    }
  };

  // set all checkbox method which sets the row all checkbox true or false based on conditions
  setAllCheckbox = (id: string | undefined, checked: boolean) => {
    if (id) {
      const moduleRightsByDesignation = this.pageRightsGridData?.find((x) => x.id === +id);
      if (!checked && moduleRightsByDesignation) {
        const canAllFormControl = <FormControl>(
          this.headerForm.get(`All_PageRight_${moduleRightsByDesignation.id}`)
        );
        if (canAllFormControl && !canAllFormControl.disabled) {
          canAllFormControl.patchValue(false);
        }
      }
      else {
        let totalCheckedCount = 0;
        if (moduleRightsByDesignation && moduleRightsByDesignation.pageAccessTypeResponse?.length) {
          moduleRightsByDesignation.pageAccessTypeResponse.forEach((permission) => {
            const PermissionType = this.permissionList.find((x) => x.id === permission.pageAccessTypeId);
            const controlName = `${PermissionType?.name}_PageRight_${moduleRightsByDesignation.id}`;
            if (PermissionType && controlName) {
              const control = this.headerForm.get(controlName);
              if (control?.value) {
                totalCheckedCount++;
              }
            }
          });
          if (totalCheckedCount === moduleRightsByDesignation.pageAccessTypeResponse?.length) {
            this.headerForm.controls[`All_PageRight_${id}`]?.patchValue(true);
          }
        }
      }
    }
  };

  // Common method for all row permission checkbox for change event
  onRowCheckBoxChange = (data: MatCheckboxChange, formControlName: string | undefined): void => {
    const id = formControlName?.split('_')[2];
    if (formControlName && formControlName.includes('View') && id) {
      if (data.checked && this.viewPermission) {
        this.getFormControlPageAccessWiseAndPatchValue(this.viewPermission.id, true, id);
      }
      else {
        this.permissionList.forEach((x) => {
          if (x.id !== this.viewPermission?.id) {
            this.getFormControlPageAccessWiseAndPatchValue(x.id, false, id);
          }
        });
      }
    }
    else {
      const checkPermissionType = this.permissionList.find((x) => formControlName?.includes(x.name));
      if (data.checked && checkPermissionType && this.viewPermission) {
        this.getFormControlPageAccessWiseAndPatchValue(checkPermissionType.id, true, id);
        this.getFormControlPageAccessWiseAndPatchValue(this.viewPermission.id, true, id);
      }
    }
    this.setAllCheckbox(id, data.checked);
    this.setHeaderCheckBox();
  };

  // If all checkbox in row is check check all the permission in that row and vice-versa
  onCanAllChange = (
    data: MatCheckboxChange,
    formControlName: string | undefined
  ): void => {
    const id = formControlName?.split('_')[2];
    this.permissionList.forEach((x) => {
      this.getFormControlPageAccessWiseAndPatchValue(x.id, data.checked, id);
    });
    this.setHeaderCheckBox();
  };

  // This method sets the header checkbox value checked or unchecked if the any row data is changed and also after view is initiated.
  setHeaderCheckBox = () => {
    const permissionCountsArray = this.permissionList.map((x) => ({ ...x, count: 0, formCount: 0, disableCount: 0 }));

    this.pageRightsGridData.forEach((pageRight) => {
      pageRight.pageAccessTypeResponse.forEach((permission) => {
        const permissionType = permissionCountsArray.find((x) => x.id === permission.pageAccessTypeId);
        if (permissionType) {
          permissionType.count++;
        }
        if (permissionType && permission.designationId && permission.designationId > 0) {
          permissionType.disableCount++;
        }
      });
    });

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const controlName in this.headerForm.controls) {
      const formControl = this.headerForm.controls[`${controlName}`];
      if (formControl) {
        const checkPermissionType = permissionCountsArray.find((x) => controlName?.includes(x.name));
        if (checkPermissionType && controlName.includes(`${checkPermissionType.name}_PageRight`) && formControl.value === true) {
          checkPermissionType.formCount++;
        }
      }
    }

    let allPermissionCount = 0;
    let allDisableCount = 0;
    permissionCountsArray.forEach((x) => {
      this.headerForm.controls[`${x.name}_Header`].patchValue(x.count && x.count === x.formCount);
      if (x.count === x.formCount) {
        allPermissionCount++;
      }
      if (x.count === x.disableCount) {
        allDisableCount++;
        this.headerForm.controls[`${x.name}_Header`].disable();
      }
    });

    if (allPermissionCount === permissionCountsArray.length) {
      this.headerForm.controls['All_Header'].patchValue(true);
    }
    else {
      this.headerForm.controls['All_Header'].patchValue(false);
    }
    if (allDisableCount === permissionCountsArray.length) {
      this.headerForm.controls['All_Header'].disable();
    }
  };

  handleSaveClick = () => {
    this.savePageRights();
  };

  resetPageRights() {
    this.filterForm.patchValue({
      member: "",
      module: this.moduleOptions[0].id,
    });
    this.submitted = false;
    this.removeAllControlsExcept([...this.permissionList.map((x) => `${x.name}_Header`), 'All_Header']);
    this.pageRightsGridData = [];
    this.permissionList.forEach((x) => {
      this.headerForm.get(`${x.name}_Header`)?.patchValue(false);
    });
    this.headerForm.get(`All_Header`)?.patchValue(false);
    this.headerForm.enable();
    this.setTableConfig();
  }

  // common method for permission checkbox formControl patch  value
  getFormControlPageAccessWiseAndPatchValue = (PageAccessType: number, value: boolean, id?: string): void => {
    const permission = this.permissionList.find((x) => x.id === PageAccessType);
    if (permission) {
      const control = <FormControl>(this.headerForm.get(`${permission.name}_PageRight_${id}`));
      if (control && !control.disabled) control.patchValue(value);
    }
  };

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      member: ["", [Validators.required]],
      module: [""]
    });

    this.headerForm = this.fb?.group({});
  }

  private getPermissionList() {
    this.service.GetPermissionList().pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IPermission[]>) => {
        if (res.isSuccess && res.data) {
          this.permissionList = res.data;
          this.setHeaderFormControl();
          const viewPermission = res.data.find((x) => x.name === "View");
          if (viewPermission) this.viewPermission = viewPermission;
        }
      },
    });
  }

  private setDropDownConfig = (): void => {
    this.memberDropdownConfig = {
      data: {
        data: this.memberOptions,
      },
      feature: {
        allowMultiple: false
      },
      id: 'member',
      formControlName: 'member',
      label: 'Member',
      isRequired: true,
      isSearchable: true,
      customFormFieldClass: 'custom-form-group large-width-field',
      onEnterPress: () => { this.getPageRights(); }
    };
    this.moduleDropdownConfig = {
      data: {
        data: this.moduleOptions,
      },
      feature: {
        allowMultiple: false
      },
      id: 'module',
      formControlName: 'module',
      label: 'Module',
      customFormFieldClass: 'custom-form-group large-width-field',
      onEnterPress: () => { this.getPageRights(); },
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => this.getPageRights());
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => this.resetPageRights());
    this.saveBtnConfig = this.uiService.getSaveButtonConfig(() => this.savePageRights());
  }

  private getMembers() {
    this.uiService.getDropdownOptions(this.generalService.getMembers(), true, { id: "", text: 'Select Member' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.memberOptions = data;
        this.setDropDownConfig();
      }
    });
  }

  private getModules() {
    this.uiService.getDropdownOptions(this.service.getModules(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.moduleOptions = data;
        this.filterForm.patchValue({
          module: data[0].id
        });
        this.setDropDownConfig();
      }
    });
  }

  private setTableConfig(): void {
    this.pageRightsGridConfig = this.getGridConfig();
  }

  private getGridColumns = () => {
    const columns: DataGridColumn<IPageRightsObject>[] = [];
    columns.push({
      field: 'menuName',
      title: 'Page Name',
      fieldDataType: DataGridFieldDataType.string,
      fieldType: DataGridFieldType.data,
      isSortable: false,
      needToShowTDClassBasedOn: "level",
    });
    this.permissionList?.forEach((x) => {
      columns.push({
        field: `${x.name}_PageRight`,
        title: x.name,
        headerEditConfig: {
          controlType: 'checkbox',
          controlConfig: {
            formControlName: `${x.name}_Header`,
            label: x.name,
            change: this.onCanChangeHeader,
          },
        },
        editConfig: {
          isEditable: true,
          controlType: 'checkbox',
          idFieldKey: 'id',
          needToShowBasedOn: 'FormControl',
          label: x.name,
          checkboxChange: this.onRowCheckBoxChange,
        },
        customHeaderClassName: 'checkbox-column',
        fieldDataType: DataGridFieldDataType.boolean,
        fieldType: DataGridFieldType.data,
        isSortable: false,
      });
    });
    columns.push({
      field: 'All_PageRight',
      title: 'All',
      headerEditConfig: {
        controlType: 'checkbox',
        controlConfig: {
          formControlName: 'All_Header',
          label: 'All',
          change: this.onCanChangeHeader,
        },
      },
      editConfig: {
        isEditable: true,
        controlType: 'checkbox',
        idFieldKey: 'id',
        needToShowBasedOn: "FormControl",
        label: "All",
        checkboxChange: this.onCanAllChange,
      },
      customHeaderClassName: 'checkbox-column',
      fieldDataType: DataGridFieldDataType.boolean,
      fieldType: DataGridFieldType.data,
      isSortable: false,
    });
    return columns;
  };

  private getGridConfig = (): DataGrid<IPageRightsObject> => {
    const config: DataGrid<IPageRightsObject> = {
      formGroup: this.headerForm,
      columns: this.getGridColumns(),
      gridData: {
        data: this.pageRightsGridData,
        dataSource: undefined,
      },
      id: 'ModuleRightsByMemberGrid',
      idFieldKey: 'id',
      displayIndexNumber: false,
      features: {
        hidePagination: true,
      },
      pageIndex: 1
    };

    return config;
  };

  private getPageRights() {
    this.isGridLoading = true;
    this.submitted = true;
    this.memberId = this.filterForm.controls['member'].value;
    const moduleId = this.filterForm.controls['module'].value;
    const memberId = this.filterForm.controls['member'].value;
    if (this.filterForm.valid && moduleId && memberId) {
      this.service.getPageRights(moduleId, memberId).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<any>) => {
          if (res.isSuccess && res.data) {
            this.pageRightsGridData = res.data;
            this.bindControls();
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

    else {
      this.isGridLoading = false;
    }
  }

  private savePageRights() {
    const modulePageAccessList: IPageAccessRequestList[] = this.pageRightsGridData.map((pageRight) => {
      const permissionArray: number[] = [];
      // get all the permission data row wise and prepare request array
      if (pageRight.pageAccessTypeResponse && pageRight.pageAccessTypeResponse.length) {
        pageRight.pageAccessTypeResponse.forEach((permission) => {
          const permissionType = this.permissionList.find((x) => x.id === permission.pageAccessTypeId);
          if (permissionType) {
            const control = <FormControl>(
              this.headerForm.get(`${permissionType.name}_PageRight_${pageRight.id}`)
            );
            if (control.value) {
              permissionArray.push(permissionType.id);
            }
          }
        });
      }
      return {
        modulePageId: pageRight.id,
        pageAccessTypeIds: permissionArray
      };
    });

    const requestObject: IPageRightsSaveModel = {
      memberId: this.memberId,
      modulePageAccessRequestList: modulePageAccessList
    };

    if (this.memberId && modulePageAccessList) {
      this.service.SavePageRights(requestObject).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<any>) => {
          if (res.isSuccess && res.data) {
            this.globalService.openSnackBar(res.message);
          }
          this.isGridLoading = false;
        },
        error: () => {
          this.isGridLoading = false;
        }
      });
    }
  }
  // #endregion
}
