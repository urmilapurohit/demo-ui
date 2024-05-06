import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Button, DropDown, GlobalService, InputType, TextArea, TextField } from 'workspace-library';
import { ACTIVE_INACTIVE_STATUS_LABEL, ACTIVE_INACTIVE_STATUS_OPTIONS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { GroupService } from '../../services/group.service';
import { IProjectGroup, IProjectGroupObject } from '../../models/group';

@Component({
  selector: 'app-add-group',
  templateUrl: './add.group.component.html',
  styleUrl: './add.group.component.css'
})
export class AddGroupComponent implements OnInit, OnDestroy {
  // #region class members
  addProjectGroupFormGroup!: FormGroup;
  name!: TextField;
  description!: TextArea;
  status!: DropDown;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  projectGroupId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: GroupService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.projectGroupId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.projectGroupId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addProjectGroupFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getProjectGroupById(Number(this.projectGroupId));
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
  getProjectGroupById(id: number) {
    this.service.getProjectGroupById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IProjectGroupObject>) => {
          if (res.isSuccess && res.data) {
            this.addProjectGroupFormGroup.setValue({
              name: res.data?.name || "",
              status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
              description: res.data?.description || "",
            });
          }
        },
      });
  }

  private initializeForm(): void {
    this.addProjectGroupFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }],
      description: ["", Validators.maxLength(500)],
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.GROUP_ABSOLUTE]); });
  }

  private setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Group' : 'Add Group';
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Group', link: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.GROUP_ABSOLUTE },
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

    this.description = {
      label: 'Description',
      formControlName: 'description',
      rows: 10,
      placeholder: '',
      customClass: 'custom-form-control'
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
    if (this.addProjectGroupFormGroup.valid) {
      const data: IProjectGroup = {
        name: this.f?.['name']?.value,
        isActive: this.f?.['status']?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        description: this.f['description'].value.trim(),
      };
      this.loading = true;
      const api = this.isEdit ? this.service.updateProjectGroup(Number(this.projectGroupId), data) : this.service.addProjectGroup(data);

      api.pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: BaseResponseModel<IProjectGroupObject>) => {
            if (res.isSuccess) {
              this.loading = false;
              this.globalService.openSnackBar(res.message);
              this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.GROUP.GROUP_ABSOLUTE]);
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
