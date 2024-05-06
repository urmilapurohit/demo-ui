import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, Checkbox, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { ProjectRoleService } from '../../services/project.role.service';
import { IProjectRole, IProjectRoleObject } from '../../models/project.role';

@Component({
  selector: 'app-add-project-role',
  templateUrl: './add.project.role.component.html',
  styleUrl: './add.project.role.component.css'
})
export class AddProjectRoleComponent implements OnInit, OnDestroy {
  // #region class Members
  addProjectRoleFormGroup!: FormGroup;
  name!: TextField;
  abbreviation!: TextField;
  isMemberIdRequired!: Checkbox;
  status!: DropDown;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  projectRoleId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: ProjectRoleService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.projectRoleId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.projectRoleId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getProjectRoleById(Number(this.projectRoleId));
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
    this.setCheckBoxConfig();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  get f() {
    return this.addProjectRoleFormGroup.controls;
  }

  // #region class methods
  getProjectRoleById(id: number) {
    this.service.getProjectRoleById(id)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe({
      next: (res: BaseResponseModel<IProjectRoleObject>) => {
        if (res.isSuccess && res.data) {
          this.addProjectRoleFormGroup.setValue({
            name: res.data?.name || "",
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            abbreviation: res.data?.abbreviation || "",
            isMemberIdRequired: res.data?.isMemberIdRequired || false
          });
        }
      },
    });
  }

  private initializeForm(): void {
    this.addProjectRoleFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(50)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }],
      abbreviation: ["", [Validators.required, Validators.maxLength(5)]],
      isMemberIdRequired: false
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_ABSOLUTE]); });
  }

  private setCheckBoxConfig = (): void => {
    this.isMemberIdRequired = {
      label: 'Is Member Id Required',
      formControlName: 'isMemberIdRequired',
      customFormFieldClass: 'custom-form-control',
    };
  };

  private setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Role' : 'Add Role';
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'Role', link: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_ABSOLUTE },
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

    this.abbreviation = {
      label: 'Abbreviation',
      formControlName: 'abbreviation',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true,
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);
  };

  private OnSave(): void {
    this.submitted = true;
    if (this.addProjectRoleFormGroup.valid) {
      const data: IProjectRole = {
        name: this.f?.['name']?.value,
        isActive: this.f?.['status']?.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        abbreviation: this.f['abbreviation'].value,
        isMemberIdRequired: this.f['isMemberIdRequired'].value
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateProjectRole(Number(this.projectRoleId), data) : this.service.addProjectRole(data);

      api.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IProjectRoleObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_ROLE.PROJECT_ROLE_ABSOLUTE]);
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
