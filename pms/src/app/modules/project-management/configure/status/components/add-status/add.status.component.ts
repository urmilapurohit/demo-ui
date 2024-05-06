import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL, ACTIVE_INACTIVE_STATUS_OPTIONS, MaxDisplayOrder } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { StatusService } from '../../services/status.service';
import { IProjectStatusAdd, IProjectStatusObject } from '../../models/status';

@Component({
  selector: 'app-add-status',
  templateUrl: './add.status.component.html',
  styleUrl: './add.status.component.css'
})
export class AddStatusComponent implements OnInit, OnDestroy {
  // #region class Members
  addProjectStatusFormGroup!: FormGroup;
  name!: TextField;
  displayOrder!: TextField;
  status!: DropDown;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  projectStatusId: string = '';
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
    this.projectStatusId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.projectStatusId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addProjectStatusFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getProjectStatusById(Number(this.projectStatusId));
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
  getProjectStatusById(id: number) {
    this.service.getProjectStatusById(id)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe({
      next: (res: BaseResponseModel<IProjectStatusObject>) => {
        if (res.isSuccess && res.data) {
          this.addProjectStatusFormGroup.setValue({
            name: res.data?.name,
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            displayOrder: Number(res.data?.displayOrder),
          });
        }
      },
    });
  }

  private initializeForm(): void {
    this.addProjectStatusFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }],
      displayOrder: [null, [Validators.required, Validators.min(1), Validators.max(MaxDisplayOrder)]],
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.STATUS.STATUS_ABSOLUTE]); });
  }
  private setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Status' : 'Add Status';
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Status', link: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.STATUS.STATUS_ABSOLUTE },
      { label: LABEL, link: '' },
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
    this.displayOrder = {
      label: 'Display order',
      formControlName: 'displayOrder',
      type: InputType.number,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true,
    };
    this.status = {
      data: {
        data: ACTIVE_INACTIVE_STATUS_OPTIONS,
      },
      feature: {
        allowMultiple: false
      },
      id: 'status',
      formControlName: 'status',
      label: 'Status',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.OnSave(); }
    };
  };

  private OnSave(): void {
    this.submitted = true;
    if (this.addProjectStatusFormGroup.valid) {
      const data: IProjectStatusAdd = {
        name: this.f?.['name']?.value,
        isActive: this.f?.['status']?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        displayOrder: Number(this.f['displayOrder'].value),
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateProjectStatus(Number(this.projectStatusId), data) : this.service.addProjectStatus(data);

      api.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IProjectStatusObject>) => {
          if (res.isSuccess) {
              this.loading = false;
              this.globalService.openSnackBar(res.message);
              this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.STATUS.STATUS_ABSOLUTE]);
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
