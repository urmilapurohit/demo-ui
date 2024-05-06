import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { Subject, takeUntil } from 'rxjs';
import { INotificationType, INotificationTypeObject } from '../../models/notification.type';
import { NotificationTypeService } from '../../services/notification.type.service';

@Component({
  selector: 'app-add.notification.type',
  templateUrl: './add.notification.type.component.html',
  styleUrl: './add.notification.type.component.css'
})
export class AddNotificationTypeComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addNotificationTypeFormGroup!: FormGroup;
  name!: TextField;
  status!: DropDown;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  notificationTypeId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: NotificationTypeService,
    private router: Router,
    private uiService: UIService,
    private route: ActivatedRoute,
    private globalService: GlobalService,
  ) {
    this.notificationTypeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.notificationTypeId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addNotificationTypeFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getNotificationTypeById(Number(this.notificationTypeId));
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
    const LABEL = this.isEdit ? 'Edit Notification Type' : 'Add Notification Type';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Notification Type', link: ROUTES.ADMIN.NOTIFICATION_TYPE.NOTIFICATION_TYPE_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addNotificationTypeFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]],
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.ADMIN.NOTIFICATION_TYPE.NOTIFICATION_TYPE_ABSOLUTE]); });
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
      isRequired: true,
      onEnterPress: () => { this.OnSave(); }
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);
  };

  private getNotificationTypeById(id: number) {
    this.service.getNotificationTypeById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<INotificationType>) => {
        if (res.isSuccess && res.data) {
          this.addNotificationTypeFormGroup.setValue({
            name: res.data?.name || "",
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addNotificationTypeFormGroup.valid) {
      const data: INotificationType = {
        name: this.f?.['name']?.value,
        isActive: this.f?.['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateNotificationType(Number(this.notificationTypeId), data) : this.service.addNotificationType(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<INotificationTypeObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.NOTIFICATION_TYPE.NOTIFICATION_TYPE_ABSOLUTE]);
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
