import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DropDown, GlobalService, InputType, SlideToggel, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { ROUTES } from '@constants/routes';
import { UIService } from '@services/ui.service';
import { colorOptions } from '@constants/constant';
import { Subject, takeUntil } from 'rxjs';
import { IAddSdlcWorkFlowStep, ISdlcWorkFlowStepObject } from '../../models/sdlc.type';
import { SDLCTypeService } from '../../services/sdlc.type.service';

@Component({
  selector: 'app-sdlc-step-edit',
  templateUrl: './sdlc.step.edit.component.html',
  styleUrl: './sdlc.step.edit.component.css'
})
export class SdlcStepEditComponent implements OnInit, OnDestroy {
  // #region class members
  editSdlcWorkFlowStepFromGroup!: FormGroup;
  name!: TextField;
  isClosed!: SlideToggel;
  color!: DropDown;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  sdlcWorkFlowStepId: string = '';
  sdlcTypeId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  heading: string = '';

  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: SDLCTypeService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.sdlcTypeId = this.route.snapshot.paramMap.get('id') ?? '';
    this.sdlcWorkFlowStepId = this.route.snapshot.paramMap.get('stepId') ?? '';
    if (Number(this.sdlcWorkFlowStepId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.editSdlcWorkFlowStepFromGroup.controls;
  }

  ngOnInit(): void {
    this.heading = `Add Flow Step`;
    this.initializeForm();
    if (this.isEdit) {
      this.getSdlcWorkFlowStepById(Number(this.sdlcWorkFlowStepId));
      this.heading = `Edit Flow Step`;
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
    this.setSlideToggleConfig();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region class methods
  private getSdlcWorkFlowStepById(id: number) {
    this.service.getSdlcWorkFlowStepById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<IAddSdlcWorkFlowStep>) => {
          if (res.isSuccess && res.data) {
            this.editSdlcWorkFlowStepFromGroup.setValue({
              name: res.data.name,
              color: res.data.color,
              isClosed: res.data.isClosed,
              projectSdlcTypeId: Number(res.data?.projectSdlcTypeId)

            });
          }
        },
      });
  }

  private initializeForm(): void {
    this.editSdlcWorkFlowStepFromGroup = this.fb?.group({
      projectSdlcTypeId: [""],
      name: ["", [Validators.required]],
      isClosed: [false, [Validators.required]],
      color: ["", [Validators.required]]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, this.sdlcTypeId]); });
  }

  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'SDLC Type', link: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.SDLC_TYPE_ABSOLUTE },
      { label: 'Edit SDLC Type', link: [ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, this.sdlcTypeId].join('/') },
      { label: this.heading, link: '' },
    ];
  }

  private setSlideToggleConfig = (): void => {
    this.isClosed = {
      label: 'Is Close',
      formControlName: 'isClosed',
      isRequired: true,
    };
  };

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true,
    };
    this.color = {
      data: {
        data: colorOptions
      },
      feature: {
        allowMultiple: false,
        isColorDropDown: true
      },
      id: 'Flow Step Color',
      formControlName: 'color',
      label: 'Select Color',
      customFormFieldClass: 'custom-form-group sm-form-group custom-color-group',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true,
    };
  };

  private OnSave(): void {
    this.submitted = true;
    if (this.editSdlcWorkFlowStepFromGroup.valid) {
      const data: IAddSdlcWorkFlowStep = {
        name: this.f?.['name']?.value,
        color: this.f?.['color']?.value,
        isClosed: this.f?.['isClosed']?.value,
        projectSdlcTypeId: Number(this.sdlcTypeId),
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateSdlcWorkFlowStep(Number(this.sdlcWorkFlowStepId), data) : this.service.addSdlcWorkFlowStep(data);

      api.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISdlcWorkFlowStepObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, this.sdlcTypeId]);
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
