import { Component, OnDestroy, OnInit, } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DropDown, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { ACTIVE_INACTIVE_STATUS_LABEL, GLOBAL_CONSTANTS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { IDepartment, IDepartmentObject } from '../../models/department';
import { DepartmentService } from '../../services/department.service';

@Component({
  selector: 'app-add-department',
  templateUrl: './add.department.component.html',
  styleUrl: './add.department.component.css'
})
export class AddDepartmentComponent implements OnInit, OnDestroy {
  // #region Class Members
  addDepartMentFormGroup!: FormGroup;
  name!: TextField;
  status!: DropDown;
  email!: TextField;
  emailCC!: TextField;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  departmentId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: DepartmentService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.departmentId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.departmentId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addDepartMentFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getDepartmentById(Number(this.departmentId));
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
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Department' : 'Add Department';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Department', link: '/admin/department' },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addDepartMentFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]],
      departmentEmail: ["", [Validators.pattern(GLOBAL_CONSTANTS.REGULAR_EXPRESSION.EMAIL)]],
      departmentEmailCc: ["", [Validators.pattern(GLOBAL_CONSTANTS.REGULAR_EXPRESSION.MULTIPLE_EMAIL)]]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.ADMIN.DEPARTMENT.DEPARTMENT_ABSOLUTE]); });
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

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);

    this.email = {
      label: 'Department Email',
      formControlName: 'departmentEmail',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); }
    };

    this.emailCC = {
      label: 'Department CC email',
      formControlName: 'departmentEmailCc',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); }
    };
  };

  private getDepartmentById(id: number) {
    this.service.getDepartmentById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IDepartmentObject>) => {
        if (res.isSuccess && res.data) {
          this.addDepartMentFormGroup.setValue({
            name: res.data?.name || "",
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            departmentEmail: res.data?.departmentEmail || "",
            departmentEmailCc: res.data?.departmentEmailCc || ""
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addDepartMentFormGroup.valid) {
      const data: IDepartment = {
        name: this.f?.['name']?.value,
        isActive: this.f?.['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        departmentEmail: this.f['departmentEmail'].value,
        departmentEmailCc: this.f['departmentEmailCc'].value
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateDepartment(Number(this.departmentId), data) : this.service.addDepartment(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IDepartmentObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.DEPARTMENT.DEPARTMENT_ABSOLUTE]);
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
