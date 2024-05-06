import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, ButtonType, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL, ACTIVE_INACTIVE_STATUS_OPTIONS, GLOBAL_CONSTANTS, MaxDisplayOrder } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { TypeService } from '../../services/type.service';
import { IProjectTypeAdd, IProjectTypeObject } from '../../models/type';

@Component({
  selector: 'app-add-type',
  templateUrl: './add.type.component.html',
  styleUrl: './add.type.component.css'
})
export class AddTypeComponent implements OnInit, OnDestroy {
  // #region class Members
  addProjectTypeFormGroup!: FormGroup;
  name!: TextField;
  displayOrder!: TextField;
  status!: DropDown;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  projectTypeId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: TypeService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {
    this.projectTypeId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.projectTypeId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addProjectTypeFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getProjectTypeById(Number(this.projectTypeId));
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
  getProjectTypeById(id: number) {
    this.service.getProjectTypeById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IProjectTypeObject>) => {
          if (res.isSuccess && res.data) {
            this.addProjectTypeFormGroup.setValue({
              name: res.data?.name,
              status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
              displayOrder: Number(res.data?.displayOrder),
            });
          }
        },
      });
  }

  private initializeForm(): void {
    this.addProjectTypeFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }],
      displayOrder: [null, [Validators.required, Validators.min(1), Validators.max(MaxDisplayOrder)]]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = {
      id: 'applyButton',
      buttonText: GLOBAL_CONSTANTS.SAVE,
      buttonType: ButtonType.default,
      className: 'primary-btn',
      callback: () => { this.OnSave(); }
    };
    this.cancelButtonConfig = {
      id: 'cancelButton',
      buttonText: GLOBAL_CONSTANTS.CANCEL,
      buttonType: ButtonType.default,
      className: 'primary-border-btn',
      callback: () => { this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.TYPE.TYPE_ABSOLUTE]); }
    };
  }
  private setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Type' : 'Add Type';
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Type', link: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.TYPE.TYPE_ABSOLUTE },
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
    if (this.addProjectTypeFormGroup.valid) {
      const data: IProjectTypeAdd = {
        name: this.f?.['name']?.value,
        isActive: this.f?.['status']?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        displayOrder: Number(this.f['displayOrder'].value),
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateProjectType(Number(this.projectTypeId), data) : this.service.addProjectType(data);

      api.pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: BaseResponseModel<IProjectTypeObject>) => {
            if (res.isSuccess) {
              this.loading = false;
              this.globalService.openSnackBar(res.message);
              this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.TYPE.TYPE_ABSOLUTE]);
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
