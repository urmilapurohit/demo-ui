import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators, FormArray, FormControl } from '@angular/forms';
import { TextField, DropDown, Button, GlobalService, InputType, BaseResponseModel, ButtonType, ButtonVariant, TooltipDirection, DropdownValue, SlideToggel } from 'workspace-library';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { BreadcrumbItem } from '@models/common.model';
import { Subject, takeUntil } from 'rxjs';
import { ISystemTypeObject, ISystemType } from '../../models/system-type';
import { SystemTypeService } from '../../services/system.type.service';

@Component({
  selector: 'app-add.system.type',
  templateUrl: './add.system.type.component.html',
  styleUrl: './add.system.type.component.css'
})
export class AddSystemTypeComponent implements OnInit, OnDestroy {
  // #region Class Members
  addSystemTypeFormGroup!: FormGroup;
  name!: TextField;
  status!: DropDown;
  itemType!: DropDown;
  isRequired!: SlideToggel;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  addItemTypeBtnConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  systemTypeId: string = '';
  itemTypeList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: SystemTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.systemTypeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.systemTypeId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addSystemTypeFormGroup.controls;
  }

  get itemTypes() {
    return this.addSystemTypeFormGroup.controls['itemTypes'] as FormArray;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getItemTypes();
    if (this.isEdit) {
      this.getSystemTypeById(Number(this.systemTypeId));
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

  // #region class methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit System Type' : 'Add System Type';
    this.breadcrumbItems = [
      { label: 'Network', link: '' },
      { label: 'Configure', link: '' },
      { label: 'System Type', link: ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.SYSTEM_TYPE_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  itemFormGroup(i: number) {
    return this.itemTypes.at(i) as FormGroup;
  }

  deleteBtnConfigHandler(i: number) {
    return this.uiService.getDeleteButtonConfig(() => { this.removeField(i); });
  }

  private getItemTypes() {
    this.uiService.getDropdownOptions(this.service.getItemTypes(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.itemTypeList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.addSystemTypeFormGroup = this.fb?.group({
      name: ["", [Validators.required]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]],
      itemTypes: this.fb.array([])
    });
  }

  private items(): FormArray {
    return this.addSystemTypeFormGroup.get("itemTypes") as FormArray;
  }

  private newItems(): FormGroup {
    return this.fb.group({
      systemTypeItemDetailId: [0],
      itemType: ["", [Validators.required]],
      isRequired: [false]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.SYSTEM_TYPE_ABSOLUTE]); });
    this.addItemTypeBtnConfig = {
      id: 'addItemTypeBtn',
      buttonText: "Add Item Type",
      buttonType: ButtonType.default,
      buttonVariant: ButtonVariant.iconWithText,
      className: 'custom-border-btn',
      imgUrl: '../../../../assets/images/plus-icon-blue.svg',
      customWidthClass: '',
      tooltip: "",
      tooltipDirection: TooltipDirection.right,
      tooltipClass: 'custom-tooltip left-pos',
      callback: () => { this.addField(); }
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

    this.itemType = {
      data: {
        data: this.itemTypeList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'itemType',
      formControlName: 'itemType',
      label: 'Item Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { },
      isRequired: true
    };

    this.isRequired = {
      label: 'Required?',
      formControlName: 'isRequired'
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);
  };

  private setFormArray(value: any) {
    const response = value.systemTypeItemDetails;
    this.itemTypes.reset();
    response?.map((res: { id: number; networkItemTypeId: number; isRequired: boolean; }) => {
      const itemExists = this.itemTypeList.some((item) => item.id === res.networkItemTypeId);
      return this.itemTypes.push(
        this.fb.group({
          systemTypeItemDetailId: new FormControl(res.id),
          itemType: new FormControl(itemExists ? res.networkItemTypeId : "", [Validators.required]),
          isRequired: new FormControl(res.isRequired)
        })
      );
    });
  }

  private addField(): void {
    if (this.addSystemTypeFormGroup.get('itemTypes')?.valid) {
      this.items().push(this.newItems());
    }
  }

  private removeField(index: number): void {
    this.itemTypes.removeAt(index);
  }

  private getSystemTypeById(id: number) {
    this.service.getSystemTypeById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ISystemTypeObject>) => {
        if (res.isSuccess && res.data) {
          this.setFormArray(res.data);
          this.addSystemTypeFormGroup.patchValue({
            name: res.data?.name || "",
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addSystemTypeFormGroup.valid) {
      const data: ISystemType = {
        name: this.f?.['name']?.value,
        systemTypeItemDetails: this.f?.['itemTypes']?.value.map((item: any) => ({
          systemTypeItemDetailId: item.systemTypeItemDetailId,
          networkItemTypeId: item.itemType,
          isRequired: item.isRequired
        })),
        isActive: this.f?.['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateSystemType(Number(this.systemTypeId), data) : this.service.addSystemType(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ISystemTypeObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.NETWORK.CONFIGURATION.SYSTEM_TYPE.SYSTEM_TYPE_ABSOLUTE]);
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
