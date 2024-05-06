import { Component, OnDestroy, OnInit } from '@angular/core';
import { BaseResponseModel, Button, Checkbox, GlobalService, InputType, TextField } from 'workspace-library';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { BreadcrumbItem } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { MaxDisplayOrder } from '@constants/constant';
import { Subject, takeUntil } from 'rxjs';
import { StatusService } from '../../services/status.service';
import { IStatus, IStatusObject } from '../../models/status.model';

@Component({
  selector: 'app-add-status',
  templateUrl: './add.status.component.html',
  styleUrl: './add.status.component.css'
})
export class AddStatusComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addStatusFormGroup!: FormGroup;
  name!: TextField;
  displayOrder!: TextField;
  isVisibleInBde!: Checkbox;
  isVisibleInBa!: Checkbox;
  isOpenInquiry!: Checkbox;
  sendStatusChangeMailToOtherMemberIds!: TextField;
  isEstimationDateRequired!: Checkbox;
  isSendStatusChangeMail!: Checkbox;
  isSendStatusChangeMailToBde!: Checkbox;
  isSendStatusChangeMailToBa!: Checkbox;
  isSendStatusChangeMailToPreSalesAdmin!: Checkbox;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  statusId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: StatusService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.statusId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.statusId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addStatusFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getStatusById(Number(this.statusId));
    }
    this.setTextBoxConfig();
    this.setCheckBoxConfig();
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
    const LABEL = this.isEdit ? 'Edit Status' : 'Add Status';
    this.breadcrumbItems = [
      { label: 'Pre-Sales', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Status', link: ROUTES.PRE_SALES.CONFIGURATION.STATUS.STATUS_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addStatusFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      displayOrder: [null, [Validators.required, Validators.min(1), Validators.max(MaxDisplayOrder)]],
      isVisibleInBde: [false],
      isVisibleInBa: [false],
      isOpenInquiry: [false],
      isEstimationDateRequired: [false],
      isSendStatusChangeMail: [false],
      isSendStatusChangeMailToBde: [false],
      isSendStatusChangeMailToBa: [false],
      isSendStatusChangeMailToPreSalesAdmin: [false],
      sendStatusChangeMailToOtherMemberIds: ["", [Validators.email, Validators.maxLength(100)]]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.STATUS.STATUS_ABSOLUTE]); });
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control large-width-field',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.displayOrder = {
      label: 'Display Order',
      formControlName: 'displayOrder',
      type: InputType.number,
      customClass: 'custom-form-control large-width-field',
      isRequired: true,
      onEnterPress: () => { this.OnSave(); }
    };

    this.sendStatusChangeMailToOtherMemberIds = {
      label: 'Mail CC To Other',
      formControlName: 'sendStatusChangeMailToOtherMemberIds',
      type: InputType.email,
      customClass: 'custom-form-control large-width-field',
      onEnterPress: () => { this.OnSave(); },
    };
  };

  private setCheckBoxConfig = (): void => {
    this.isVisibleInBde = {
      label: 'BDE',
      formControlName: 'isVisibleInBde',
      customFormFieldClass: 'custom-form-control',
    };

    this.isVisibleInBa = {
      label: 'BA',
      formControlName: 'isVisibleInBa',
      customFormFieldClass: 'custom-form-control',
    };

    this.isOpenInquiry = {
      label: 'Is Open Inquiry',
      formControlName: 'isOpenInquiry',
      customFormFieldClass: 'custom-form-control',
    };

    this.isEstimationDateRequired = {
      label: 'Is Estimation Date Required',
      formControlName: 'isEstimationDateRequired',
      customFormFieldClass: 'custom-form-control',
    };

    this.isSendStatusChangeMail = {
      label: 'Send Mail Reminder',
      formControlName: 'isSendStatusChangeMail',
      customFormFieldClass: 'custom-form-control',
    };

    this.isSendStatusChangeMailToBde = {
      label: 'BDE',
      formControlName: 'isSendStatusChangeMailToBde',
      customFormFieldClass: 'custom-form-control',
    };

    this.isSendStatusChangeMailToBa = {
      label: 'BA',
      formControlName: 'isSendStatusChangeMailToBa',
      customFormFieldClass: 'custom-form-control',
    };

    this.isSendStatusChangeMailToPreSalesAdmin = {
      label: 'Mail CC To Presales Admin',
      formControlName: 'isSendStatusChangeMailToPreSalesAdmin',
      customFormFieldClass: 'custom-form-control',
    };
  };

  private getStatusById(id: number) {
    this.service.getStatusById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IStatusObject>) => {
        if (res.isSuccess && res.data) {
          this.addStatusFormGroup.setValue({
            name: res.data?.name || "",
            displayOrder: res.data?.displayOrder,
            isVisibleInBde: res.data?.isVisibleInBde,
            isVisibleInBa: res.data?.isVisibleInBa,
            isOpenInquiry: res.data?.isOpenInquiry,
            isEstimationDateRequired: res.data?.isEstimationDateRequired,
            isSendStatusChangeMail: res.data?.isSendStatusChangeMail,
            isSendStatusChangeMailToBde: res.data?.isSendStatusChangeMailToBde,
            isSendStatusChangeMailToBa: res.data?.isSendStatusChangeMailToBa,
            isSendStatusChangeMailToPreSalesAdmin: res.data?.isSendStatusChangeMailToPreSalesAdmin,
            sendStatusChangeMailToOtherMemberIds: res.data?.sendStatusChangeMailToOtherMemberIds ?? ""
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addStatusFormGroup.valid) {
      const data: IStatus = {
        name: this.f?.['name']?.value,
        displayOrder: this.f?.['displayOrder']?.value,
        isVisibleInBde: this.f?.['isVisibleInBde']?.value,
        isVisibleInBa: this.f?.['isVisibleInBa']?.value,
        isOpenInquiry: this.f?.['isOpenInquiry']?.value,
        isEstimationDateRequired: this.f?.['isEstimationDateRequired']?.value,
        isSendStatusChangeMail: this.f?.['isSendStatusChangeMail']?.value,
        isSendStatusChangeMailToBde: this.f?.['isSendStatusChangeMailToBde']?.value,
        isSendStatusChangeMailToBa: this.f?.['isSendStatusChangeMailToBa']?.value,
        isSendStatusChangeMailToPreSalesAdmin: this.f?.['isSendStatusChangeMailToPreSalesAdmin']?.value,
        sendStatusChangeMailToOtherMemberIds: this.f?.['sendStatusChangeMailToOtherMemberIds']?.value ?? ""
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateStatus(Number(this.statusId), data) : this.service.addStatus(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IStatusObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.PRE_SALES.CONFIGURATION.STATUS.STATUS_ABSOLUTE]);
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    }
    this.loading = false;
  }
  // #endregion
}
