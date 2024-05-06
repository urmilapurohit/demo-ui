import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, ButtonType, Checkbox, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { GLOBAL_CONSTANTS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { DesignationService } from '../../services/designation.service';
import { IDesignation, IDesignationObject } from '../../models/designation';

@Component({
  selector: 'app-add-designation',
  templateUrl: './add.designation.component.html',
  styleUrl: './add.designation.component.css'
})
export class AddDesignationComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addDesignationFormGroup!: FormGroup;
  name!: TextField;
  abbreviation!: TextField;
  canBeAssessor!: Checkbox;
  canBeReviewer!: Checkbox;
  canBeProjectMember!: Checkbox;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  designationId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: DesignationService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {
    this.designationId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.designationId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addDesignationFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getDesignationById(Number(this.designationId));
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setCheckBoxConfig();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Designation' : 'Add Designation';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Designation', link: ROUTES.ADMIN.DESIGNATION.DESIGNATION_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }
  private initializeForm(): void {
    this.addDesignationFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      abbreviation: ["", [Validators.maxLength(20)]],
      canBeAssessor: false,
      canBeReviewer: false,
      canBeProjectMember: false
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
      callback: () => { this.router.navigate([ROUTES.ADMIN.DESIGNATION.DESIGNATION_ABSOLUTE]); }
    };
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

    this.abbreviation = {
      label: 'Abbreviation',
      formControlName: 'abbreviation',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
    };
  };

  private setCheckBoxConfig = (): void => {
    this.canBeAssessor = {
      label: 'Can Be Assessor',
      formControlName: 'canBeAssessor',
      customFormFieldClass: 'custom-form-control',
    };

    this.canBeReviewer = {
      label: 'Can Be Reviewer',
      formControlName: 'canBeReviewer',
      customFormFieldClass: 'custom-form-control',
    };

    this.canBeProjectMember = {
      label: 'Can Be Project Member',
      formControlName: 'canBeProjectMember',
      customFormFieldClass: 'custom-form-control',
    };
  };

  private getDesignationById(id: number) {
    this.service.getDesignationById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IDesignationObject>) => {
        if (res.isSuccess && res.data) {
          this.addDesignationFormGroup.setValue({
            name: res.data?.name || "",
            abbreviation: res.data?.abbreviation || "",
            canBeAssessor: res.data?.canBeAssessor || false,
            canBeReviewer: res.data?.canBeReviewer || false,
            canBeProjectMember: res.data?.canBeProjectMember || false,
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addDesignationFormGroup.valid) {
      const data: IDesignation = {
        name: this.f?.['name']?.value,
        abbreviation: this.f?.['abbreviation']?.value,
        canBeAssessor: this.f?.['canBeAssessor']?.value,
        canBeReviewer: this.f?.['canBeReviewer']?.value,
        canBeProjectMember: this.f?.['canBeProjectMember']?.value,
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateDesignation(Number(this.designationId), data) : this.service.addDesignation(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IDesignationObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.DESIGNATION.DESIGNATION_ABSOLUTE]);
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
