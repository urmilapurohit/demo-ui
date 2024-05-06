import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, Checkbox, DropDown, GlobalService, InputType, TextArea, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { ItemTypeService } from '../../services/item.type.service';
import { IItemType, IItemTypeObject } from '../../models/item.type';

@Component({
  selector: 'app-add-item-type',
  templateUrl: './add.item.type.component.html',
  styleUrl: './add.item.type.component.css'
})
export class AddItemTypeComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addItemTypeForm!: FormGroup;
  name!: TextField;
  description!: TextArea;
  status!: DropDown;
  isSerialRequired!: Checkbox;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  itemTypeId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: ItemTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.itemTypeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.itemTypeId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addItemTypeForm.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getItemTypeById(Number(this.itemTypeId));
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

  // #region methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Item Type' : 'Add Item Type';
    this.breadcrumbItems = [
      { label: 'Network', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Item Type', link: ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addItemTypeForm = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(200)]],
      description: ["", [Validators.required, Validators.maxLength(500)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }],
      isSerial: [true],
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE_ABSOLUTE]); });
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
      isRequired: true
    };

    this.description = {
      label: 'Description',
      formControlName: 'description',
      rows: 10,
      placeholder: '',
      customClass: 'custom-form-control',
      isRequired: true
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);

    this.isSerialRequired = {
      label: 'Is Serial Required?',
      formControlName: 'isSerial',
    };
  };

  private getItemTypeById(id: number) {
    this.service.getItemTypeById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IItemTypeObject>) => {
        if (res.isSuccess && res.data) {
          this.addItemTypeForm.setValue({
            name: res.data?.name || "",
            description: res.data?.description,
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            isSerial: res.data?.isSerialRequired
          });
        }
      },
      error: () => {
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;

    if (this.addItemTypeForm.valid) {
      const data: IItemType = {
        name: this.f?.['name']?.value,
        description: this.f?.['description']?.value,
        isActive: this.f['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        isSerialRequired: this.f['isSerial'].value
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateItemType(Number(this.itemTypeId), data) : this.service.addItemType(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IItemTypeObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.NETWORK.CONFIGURATION.ITEM_TYPE.ITEM_TYPE_ABSOLUTE]);
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
