import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, ButtonType, GlobalService, InputType, TextField } from 'workspace-library';
import { ROUTES } from '@constants/routes';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { GLOBAL_CONSTANTS } from '@constants/constant';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { SDLCTypeService } from '../../services/sdlc.type.service';
import { IAddSdlcType, ISdlcTypeObject } from '../../models/sdlc.type';

@Component({
  selector: 'app-sdlc-add',
  templateUrl: './sdlc.add.component.html',
  styleUrl: './sdlc.add.component.css'
})
export class SdlcAddComponent implements OnInit, OnDestroy {
  // #region class members
  addSdlcTypeFormGroup!: FormGroup;
  name!: TextField;
  saveButtonConfig!: Button;
  saveAndContinueButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  breadcrumbItems: BreadcrumbItem[] = [];

  private ngUnsubscribe$ = new Subject<void>();

  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: SDLCTypeService,
    private router: Router,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
  }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  get f() {
    return this.addSdlcTypeFormGroup.controls;
  }

  // #region class methods
  private setBreadcrumb(): void {
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'SDLC Type', link: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.SDLC_TYPE_ABSOLUTE },
      { label: 'Add SDLC Type', link: '' },
    ];
  }

  private initializeForm(): void {
    this.addSdlcTypeFormGroup = this.fb?.group({
      name: ["", [Validators.required]],
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(false); });
    this.saveAndContinueButtonConfig = {
      id: 'applyAndContinueButton',
      buttonText: GLOBAL_CONSTANTS.SAVE_AND_CONTINUE,
      buttonType: ButtonType.default,
      className: 'primary-btn',
      callback: () => {
        this.OnSave(true);
      }
    };
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.SDLC_TYPE_ABSOLUTE]); });
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(false); },
      isRequired: true,
    };
  };

  private OnSave(isSaveAndContinue: boolean): void {
    this.submitted = true;
    if (this.addSdlcTypeFormGroup.valid) {
      const data: IAddSdlcType = {
        name: this.f?.['name']?.value,
        isActive: true
      };
      this.loading = true;

      this.service.addSdlcType(data)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (res: BaseResponseModel<ISdlcTypeObject>) => {
            if (res.isSuccess) {
              this.loading = false;
              this.globalService.openSnackBar(res.message);
              if (isSaveAndContinue) {
                this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, res.data.id]);
              } else {
                this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.SDLC_TYPE_ABSOLUTE]);
              }
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
