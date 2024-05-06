import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TextField, DropDown, Button, InputType, BaseResponseModel, GlobalService } from 'workspace-library';
import { ROUTES } from '@constants/routes';
import { ACTIVE_INACTIVE_STATUS_LABEL, colorOptions } from '@constants/constant';
import { BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { ISystemStatusObject, ISystemStatus } from '../../models/system.status';
import { SystemStatusService } from '../../services/system.status.service';

@Component({
  selector: 'app-add.system.status',
  templateUrl: './add.system.status.component.html',
  styleUrl: './add.system.status.component.css'
})
export class AddSystemStatusComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addSystemStatusFormGroup!: FormGroup;
  name!: TextField;
  status!: DropDown;
  color!: DropDown;
  displayOrder!: TextField;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  systemStatusId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: SystemStatusService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.systemStatusId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.systemStatusId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addSystemStatusFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getSystemStatusById(Number(this.systemStatusId));
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
    const LABEL = this.isEdit ? 'Edit System Status' : 'Add System Status';
    this.breadcrumbItems = [
      { label: 'Network', link: '' },
      { label: 'Configure', link: '' },
      { label: 'System Status', link: ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.SYSTEM_STATUS_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addSystemStatusFormGroup = this.fb?.group({
      name: ["", [Validators.required]],
      labelColor: ["", [Validators.required]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]],
      displayOrder: [null, [Validators.required, Validators.min(1), Validators.maxLength(2)]]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.SYSTEM_STATUS_ABSOLUTE]); });
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

    this.color = {
      data: {
        data: colorOptions
      },
      feature: {
        allowMultiple: false,
        isColorDropDown: true
      },
      id: 'color',
      formControlName: 'labelColor',
      label: 'Label Color',
      customFormFieldClass: 'custom-form-group sm-form-group custom-color-group',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.displayOrder = {
      label: 'Display Order',
      formControlName: 'displayOrder',
      type: InputType.number,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);
  };

  private getSystemStatusById(id: number) {
    this.service.getSystemStatusById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ISystemStatusObject>) => {
        if (res.isSuccess && res.data) {
          this.addSystemStatusFormGroup.setValue({
            name: res.data?.name || "",
            labelColor: res.data?.color || "",
            displayOrder: res.data?.displayOrder,
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addSystemStatusFormGroup.valid) {
      const data: ISystemStatus = {
        name: this.f?.['name']?.value,
        color: this.f?.['labelColor']?.value,
        displayOrder: this.f?.['displayOrder'].value,
        isActive: this.f?.['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateSystemStatus(Number(this.systemStatusId), data) : this.service.addSystemStatus(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ISystemStatusObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.NETWORK.CONFIGURATION.SYSTEM_STATUS.SYSTEM_STATUS_ABSOLUTE]);
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
