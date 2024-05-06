import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Button, FileInput, FileInputComponent, GlobalService, InputType, SlideToggel, TextField } from 'workspace-library';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { ROUTES } from '@constants/routes';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { IFileListType, ISdlcWorkFlowTypeObject } from '../../models/sdlc.type';
import { SDLCTypeService } from '../../services/sdlc.type.service';

@Component({
  selector: 'app-sdlc-type-edit',
  templateUrl: './sdlc.type.edit.component.html',
  styleUrl: './sdlc.type.edit.component.css'
})
export class SdlcTypeEditComponent implements OnInit, OnDestroy {
    // #region class members
  @ViewChild('fileInputComponent') fileInputComponent: FileInputComponent | undefined;
  editSdlcWorkFlowTypeFromGroup!: FormGroup;
  name!: TextField;
  abbreviation!: TextField;
  icon!: FileInput;
  isDefect!: SlideToggel;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  fileSubmitted: boolean = false;
  sdlcWorkFlowTypeId: string = '';
  sdlcTypeId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  fileList: IFileListType[] = [];
  fileError: boolean = false;

  heading: string = '';
  allowedExtensions = ['svg'];
  selectedFiles: File | null = null;
  customErrorMessage: string = '';

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
    this.sdlcWorkFlowTypeId = this.route.snapshot.paramMap.get('typeId') ?? '';
    if (Number(this.sdlcWorkFlowTypeId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  ngOnInit(): void {
    this.heading = `Add Flow Type`;
    this.initializeForm();
    if (this.isEdit) {
      this.getSdlcWorkFlowTypeById(Number(this.sdlcWorkFlowTypeId));
      this.heading = `Edit Flow Type`;
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
  fileBrowseHandler(file: File[] | null) {
    this.editSdlcWorkFlowTypeFromGroup.setValue({
      ...this.editSdlcWorkFlowTypeFromGroup.value,
      icon: file
    });
    this.prepareFilesList(file);
  }

  handleFileErrorStatusChange(fileErrorStatus: boolean) {
    this.fileError = fileErrorStatus;
  }

  deleteFile(id: number) {
    const index = this.fileList.findIndex((file) => file.id === id);
    if (index !== -1) {
      this.fileList.splice(index, 1);
    }
    this.editSdlcWorkFlowTypeFromGroup.setValue({
      ...this.editSdlcWorkFlowTypeFromGroup.value,
      icon: null
    });
    if (this.fileInputComponent) {
      this.fileInputComponent.clearFileData();
    }
  }

  previewDocument(file: { id: number, name: string }) {
    const files = this.editSdlcWorkFlowTypeFromGroup.get('icon')!.value;
    if (file.id) {
      this.service.getIconPreview(file.id, 'blob')
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe((blob: Blob) => {
          this.uiService.openFile(blob);
        });
    } else {
      this.uiService.openFile(files[0]);
    }
  }

  private prepareFilesList = (files: File[] | null) => {
    if (files) {
      this.fileList = [];
      this.fileList = [...this.fileList, { id: 0, name: files[0].name }];
    }
  };

  private prepareFormData(): FormData {
    const file = this.editSdlcWorkFlowTypeFromGroup.get('icon')?.value;
    const formData = new FormData();
    formData.append('name', this.editSdlcWorkFlowTypeFromGroup.get('name')!.value.trim());
    formData.append('abbreviation', this.editSdlcWorkFlowTypeFromGroup.get('abbreviation')!.value);
    formData.append('isDefect', this.editSdlcWorkFlowTypeFromGroup.get('isDefect')!.value);
    if (file) {
      formData.append('file.formFile', file[0], file[0].name);
    }
    formData.append('file.fileName', '');
    formData.append('file.uniqueFileName', '');
    formData.append('projectSdlcTypeId', this.editSdlcWorkFlowTypeFromGroup.get('projectSdlcTypeId')!.value);
    return formData;
  }

  private getSdlcWorkFlowTypeById(id: number) {
    this.service.getSdlcWorkFlowTypeById(id)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISdlcWorkFlowTypeObject>) => {
          if (res.isSuccess && res.data) {
            this.editSdlcWorkFlowTypeFromGroup.setValue({
              name: res.data.name,
              isDefect: res.data.isDefect,
              projectSdlcTypeId: Number(res.data?.projectSdlcTypeId),
              abbreviation: res.data.abbreviation,
              icon: null
            });
            if (res.data?.iconFileName) {
              this.fileList = [...this.fileList, { id: res.data.id, name: res.data.iconFileName }];
            } else {
              this.fileList = [];
            }
          }
        },
      });
  }

  private initializeForm(): void {
    this.editSdlcWorkFlowTypeFromGroup = this.fb?.group({
      projectSdlcTypeId: [this.sdlcTypeId],
      abbreviation: ["", [Validators.required, Validators.maxLength(5)]],
      name: ["", [Validators.required]],
      isDefect: [false, [Validators.required]],
      icon: [null]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, this.sdlcTypeId]); });
  }

  private setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Flow Type' : 'Add Flow Type';
    this.breadcrumbItems = [
      { label: 'Project Management', link: '' },
      { label: 'Configure', link: '' },
      { label: 'SDLC Type', link: ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.SDLC_TYPE_ABSOLUTE },
      { label: 'Edit SDLC Type', link: [ROUTES.PROJECT_MANAGEMENT.CONFIGURE.PROJECT_SDLC.EDIT_SDLC_TYPE_ABSOLUTE, this.sdlcTypeId].join('/') },
      { label: LABEL, link: '' },
    ];
  }

  private setSlideToggleConfig = (): void => {
    this.isDefect = {
      label: 'Is Defect',
      formControlName: 'isDefect',
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
    this.abbreviation = {
      label: 'Abbreviation',
      formControlName: 'abbreviation',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true,
    };
    this.icon = {
      label: "Icon",
      maxSize: 10,
      allowedExtensions: ['.png', '.jpeg', '.jpg'],
      multipleSelection: false,
      isRequired: true
    };
  };

  private OnSave(): void {
    this.submitted = true;
    this.fileSubmitted = true;
    timer(200).subscribe(() => {
      this.handleSubmit();
    });
  }

  private handleSubmit(): void {
    const isFormValid = this.editSdlcWorkFlowTypeFromGroup.valid;
    const hasSelectedFiles = this.fileList && this.fileList.length > 0;
    if ((isFormValid && hasSelectedFiles && ((!this.fileError && !hasSelectedFiles) || hasSelectedFiles)) && !this.fileError) {
      const formData = this.prepareFormData();
      this.loading = true;

      const api = this.isEdit ? this.service.updateSdlcWorkFlowType(Number(this.sdlcWorkFlowTypeId), formData) : this.service.addSdlcWorkFlowType(formData);

      api.pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (res: BaseResponseModel<ISdlcWorkFlowTypeObject>) => {
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
