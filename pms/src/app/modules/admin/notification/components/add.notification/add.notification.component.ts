import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DropDown, DropdownValue, FormField, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem, CkEditor } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { INotification, INotificationObject } from '../../models/notification';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add.notification',
  templateUrl: './add.notification.component.html',
  styleUrl: './add.notification.component.css'
})
export class AddNotificationComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addNotificationTypeDetailFormGroup!: FormGroup;
  title!: TextField;
  status!: DropDown;
  priority!: DropDown;
  notificationType!: DropDown;
  description!: FormField;
  ckEditorConfig!: CkEditor;
  emailCC!: TextField;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  notificationTypeDetailId: string = '';
  notificationTypeId: string = '';
  notificationPriorityOptions: DropdownValue[] = [];
  notificationTypeOptions: DropdownValue[] = [];
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: NotificationService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.notificationTypeDetailId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.notificationTypeDetailId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addNotificationTypeDetailFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    this.getNotificationPriorityOptions();
    this.getNotificationTypeOptions();
    if (this.isEdit) {
      this.getNotificationById(Number(this.notificationTypeDetailId));
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
    this.setEditorConfig();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Notification' : 'Add Notification';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Notification', link: ROUTES.ADMIN.NOTIFICATION.NOTIFICATION_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private getNotificationPriorityOptions() {
    this.uiService.getDropdownOptions(this.service.getNotificationPriorityDropdown(), true, { id: "", text: 'Select Priority' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.notificationPriorityOptions = data;
        this.setTextBoxConfig();
      }
    });
  }

  private getNotificationTypeOptions() {
    this.uiService.getDropdownOptions(this.service.getNotificationTypeDropdown(), true, { id: "", text: 'Select Type' }).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.notificationTypeOptions = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.addNotificationTypeDetailFormGroup = this.fb?.group({
      title: ["", [Validators.required, Validators.maxLength(100)]],
      description: [""],
      priority: ["", [Validators.required]],
      notificationType: ["", [Validators.required]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]],
    });
  }

  private setEditorConfig(): void {
    this.ckEditorConfig = {
      label: 'Description',
      formControlName: 'description',
      customClass: 'custom-form-control',
    };
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.ADMIN.NOTIFICATION.NOTIFICATION_ABSOLUTE]); });
  }

  private setTextBoxConfig = (): void => {
    this.title = {
      label: 'Title',
      formControlName: 'title',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.description = {
      label: 'Description',
      formControlName: 'description',
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);

    this.priority = {
      data: {
        data: this.notificationPriorityOptions,
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: false,
      isRequired: true,
      id: 'priority',
      formControlName: 'priority',
      label: 'Priority',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.OnSave(); }
    };
    this.notificationType = {
      data: {
        data: this.notificationTypeOptions,
      },
      feature: {
        allowMultiple: false
      },
      isSearchable: false,
      isRequired: true,
      id: 'notificationType',
      formControlName: 'notificationType',
      label: 'Notification Type',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.OnSave(); }
    };
  };

  private getNotificationById(id: number) {
    this.service.getNotificationById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<INotificationObject>) => {
        if (res.isSuccess && res.data) {
          this.notificationTypeId = String(res.data?.notificationTypeId) || "";
          this.addNotificationTypeDetailFormGroup.setValue({
            notificationType: res?.data?.notificationTypeId || "",
            title: res.data?.title || "",
            description: res.data?.description || "",
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            priority: res.data?.priorityId || "",
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addNotificationTypeDetailFormGroup.valid) {
      const data: INotification = {
        notificationTypeId: this.f['notificationType'].value,
        title: this.f['title'].value,
        description: this.f?.['description']?.value,
        isActive: this.f?.['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        priorityId: this.f['priority'].value,
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateNotificationByType(Number(this.notificationTypeDetailId), data) : this.service.addNotificationByType(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<INotificationObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.NOTIFICATION.NOTIFICATION_ABSOLUTE]);
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
