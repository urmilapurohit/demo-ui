import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseResponseModel, Button, ButtonType, DropDown, GLOBAL_CONSTANTS, GlobalService, InputType, TextField } from 'workspace-library';
import { Router, ActivatedRoute } from '@angular/router';
import { BreadcrumbItem } from '@models/common.model';
import { ACTIVE_INACTIVE_STATUS_LABEL, ACTIVE_INACTIVE_STATUS_OPTIONS } from '@constants/constant';
import { ROUTES } from '@constants/routes';
import { Subject, takeUntil } from 'rxjs';
import { TechnicalSkillService } from '../../services/technical.skill.service';
import { ITechnicalSkillObject, ITechnicalSkill } from '../../models/technical.skill';

@Component({
  selector: 'app-add.technical-skill',
  templateUrl: './add.technical.skill.component.html',
  styleUrl: './add.technical.skill.component.css'
})
export class AddTechnicalSkillComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addTechnicalSkillFormGroup!: FormGroup;
  name!: TextField;
  abbreviation!: TextField;
  status!: DropDown;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  technicalSkillId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: TechnicalSkillService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
  ) {
    this.technicalSkillId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.technicalSkillId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addTechnicalSkillFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getTechnicalSkillById(Number(this.technicalSkillId));
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
    const LABEL = this.isEdit ? 'Edit Technical Skill' : 'Add Technical Skill';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Technical Skills', link: ROUTES.ADMIN.TECHNICAL_SKILL.TECHNICAL_SKILL_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addTechnicalSkillFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]],
      abbreviation: ["", [Validators.required, Validators.maxLength(20)]]
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
      callback: () => { this.router.navigate([ROUTES.ADMIN.TECHNICAL_SKILL.TECHNICAL_SKILL_ABSOLUTE]); }
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
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.abbreviation = {
      label: 'Abbreviation',
      formControlName: 'abbreviation',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };
  };

  private getTechnicalSkillById(id: number) {
    this.service.getTechnicalSkillById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<ITechnicalSkillObject>) => {
        if (res.isSuccess && res.data) {
          this.addTechnicalSkillFormGroup.setValue({
            name: res.data?.name || "",
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            abbreviation: res.data?.abbreviation || ""
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addTechnicalSkillFormGroup.valid) {
      const data: ITechnicalSkill = {
        name: this.f?.['name']?.value,
        isActive: this.f?.['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE,
        abbreviation: this.f?.['abbreviation'].value
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateTechnicalSkill(Number(this.technicalSkillId), data) : this.service.addTechnicalSkill(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<ITechnicalSkillObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.TECHNICAL_SKILL.TECHNICAL_SKILL_ABSOLUTE]);
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
