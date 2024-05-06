import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseResponseModel, Button, GlobalService, InputType, TextArea, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { Subject, takeUntil } from 'rxjs';
import { IApplicationConfiguration, IApplicationConfigurationObject } from '../../models/application.configuration';
import { ApplicationConfigurationService } from '../../services/application.configuration.service';

@Component({
  selector: 'app-add.application.configuration',
  templateUrl: './add.application.configuration.component.html',
  styleUrl: './add.application.configuration.component.css'
})
export class AddApplicationConfigurationComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addApplicationConfiguration!: FormGroup;
  name!: TextField;
  configValue!: TextField;
  dataType!: TextField;
  description!: TextArea;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  configurationId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: ApplicationConfigurationService,
    private router: Router,
    private uiService: UIService,
    private route: ActivatedRoute,
    private globalService: GlobalService,
  ) {
    this.configurationId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.configurationId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addApplicationConfiguration.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getApplicationConfigurationById(Number(this.configurationId));
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
    const LABEL = this.isEdit ? 'Edit Application Configuration' : 'Add Application Configuration';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Application Configuration', link: ROUTES.ADMIN.APPLICATION_CONFIGURATION.APPLICATION_CONFIGURATION_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addApplicationConfiguration = this.fb?.group({
      name: [{ value: "", disabled: this.isEdit }, [Validators.maxLength(250)]],
      description: [{ value: "", disabled: this.isEdit }, [Validators.maxLength(500)]],
      configValue: ["", [Validators.required]],
      dataType: [{ value: "", disabled: this.isEdit }, [Validators.maxLength(250)]],
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.ADMIN.APPLICATION_CONFIGURATION.APPLICATION_CONFIGURATION_ABSOLUTE]); });
  }

  private setTextBoxConfig = (): void => {
    this.name = {
      label: 'Name',
      formControlName: 'name',
      type: InputType.text,
      customClass: 'custom-form-control',
    };

    this.description = {
      label: 'Description',
      formControlName: 'description',
      rows: 15,
      placeholder: '',
      customClass: 'custom-form-control'
    };

    this.dataType = {
      label: 'Data Type',
      formControlName: 'dataType',
      type: InputType.text,
      customClass: 'custom-form-control',
    };

    this.configValue = {
      label: 'Configuration Value',
      formControlName: 'configValue',
      type: InputType.text,
      customClass: 'custom-form-control',
      isRequired: true,
      onEnterPress: () => { this.OnSave(); }
    };
  };

  private getApplicationConfigurationById(id: number) {
    this.service.getApplicationConfigurationById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IApplicationConfigurationObject>) => {
        if (res.isSuccess && res.data) {
          this.addApplicationConfiguration.setValue({
            name: res.data?.name || "",
            description: res.data?.description,
            configValue: res.data?.configValue || "",
            dataType: res.data?.dataType || "",
          });
        }
      }
    });
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addApplicationConfiguration.valid) {
      const data: IApplicationConfiguration = {
        configValue: this.f?.['configValue']?.value,
      };
      this.loading = true;

      if (this.isEdit) {
        this.service.updateApplicationConfiguration(Number(this.configurationId), data).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
          next: (res: BaseResponseModel<IApplicationConfigurationObject>) => {
            if (res.isSuccess) {
              this.loading = false;
              this.globalService.openSnackBar(res.message);
              this.router.navigate([ROUTES.ADMIN.APPLICATION_CONFIGURATION.APPLICATION_CONFIGURATION_ABSOLUTE]);
            }
          },
          error: () => {
            this.loading = false;
          }
        });
      }
    }
  }
  // #endregion
}
