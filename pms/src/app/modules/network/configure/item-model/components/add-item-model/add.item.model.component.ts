import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DropDown, DropdownValue, GlobalService, InputType, TextArea, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { ItemModelService } from '../../services/item.model.service';
import { IItemModel, IItemModelObject } from '../../models/item.model';

@Component({
  selector: 'app-add-item-model',
  templateUrl: './add.item.model.component.html',
  styleUrl: './add.item.model.component.css'
})
export class AddItemModelComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addItemModelForm!: FormGroup;
  itemType!: DropDown;
  name!: TextField;
  description!: TextArea;
  status!: DropDown;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  itemModelId: string = '';
  itemTypeList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: ItemModelService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.itemModelId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.itemModelId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addItemModelForm.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getItemModelById(Number(this.itemModelId));
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.getItemTypeList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Item Model' : 'Add Item Model';
    this.breadcrumbItems = [
      { label: 'Network', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Item Model', link: ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addItemModelForm = this.fb.group({
      networkItemType: ["", [Validators.required]],
      name: ["", [Validators.required, Validators.maxLength(200)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }],
      description: ["", [Validators.maxLength(500)]],
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL_ABSOLUTE]); });
  }

  private setTextBoxConfig = (): void => {
    this.itemType = {
      data: {
        data: this.itemTypeList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'itemType',
      formControlName: 'networkItemType',
      label: 'Item Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
      isRequired: true
    };

    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
      isRequired: true
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);

    this.description = {
      label: 'Description',
      formControlName: 'description',
      rows: 10,
      placeholder: '',
      customClass: 'custom-form-control'
    };
  };

  private getItemModelById(id: number) {
    this.service.getItemModelById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IItemModelObject>) => {
        if (res.isSuccess && res.data) {
          this.addItemModelForm.setValue({
            networkItemType: res.data.networkItemTypeId || "",
            name: res.data?.name || "",
            description: res.data?.description,
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;

    if (this.addItemModelForm.valid) {
      const data: IItemModel = {
        networkItemTypeId: this.f?.['networkItemType']?.value,
        name: this.f?.['name']?.value,
        description: this.f?.['description']?.value,
        isActive: this.f['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateItemModel(Number(this.itemModelId), data) : this.service.addItemModel(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IItemModelObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.NETWORK.CONFIGURATION.ITEM_MODEL.ITEM_MODEL_ABSOLUTE]);
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    }
  }

  private getItemTypeList() {
    this.uiService.getDropdownOptions(this.service.getItemTypeDropDown(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.itemTypeList = data;
        this.setTextBoxConfig();
      }
    });
  }
  // #endregion
}
