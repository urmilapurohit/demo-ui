import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject, takeUntil, timer } from 'rxjs';
import { Button, DateField, DropDown, FileInput, FileInputComponent, GlobalService, InputType, TextField } from 'workspace-library';
import { BaseResponseModel, BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { ACTIVE_INACTIVE_STATUS_LABEL } from '@constants/constant';
import { DateFormats } from '@constants/Enums';
import { NewsEventService } from '../../services/news.event.service';
import { INewsEventObject, IFileList } from '../../models/news.event';

@Component({
  selector: 'app-add-news-event',
  templateUrl: './add.news.event.component.html',
  styleUrl: './add.news.event.component.css'
})
export class AddNewsEventComponent implements OnInit, OnDestroy {
  // #region initialize variables
  @ViewChild('fileInputComponent') fileInputComponent: FileInputComponent | undefined;
  addNewsEventForm!: FormGroup;
  title!: TextField;
  startDate!: DateField;
  endDate!: DateField;
  status!: DropDown;
  file!: FileInput;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  newsEventId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  fileList: IFileList[] = [];
  fileError: boolean = false;
  fileSubmitted: boolean = false;
  isFileRemoved: boolean = false;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: NewsEventService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.newsEventId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.newsEventId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addNewsEventForm.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getNewsEventById(Number(this.newsEventId));
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
    const LABEL = this.isEdit ? 'Edit News/Event' : 'Add News/Event';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'News/Event', link: ROUTES.ADMIN.NEWS_EVENT.NEWS_EVENT_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  fileBrowseHandler(file: File[] | null) {
    this.addNewsEventForm.setValue({
      ...this.addNewsEventForm.value,
      status: this.addNewsEventForm.get('status')!.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE ? 'Active' : 'InActive',
      file
    });
    this.prepareFilesList(file);
    this.isFileRemoved = false;
  }

  handleFileError(fileErrorStatus: boolean) {
    this.fileError = fileErrorStatus;
  }

  deleteFile(id: number) {
    const index = this.fileList.findIndex((file) => file.id === id);
    if (index !== -1) {
      this.fileList.splice(index, 1);
    }
    this.addNewsEventForm.setValue({
      ...this.addNewsEventForm.value,
      status: this.addNewsEventForm.get('status')!.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE ? 'Active' : 'InActive',
      file: null
    });
    if (this.fileInputComponent) {
      this.fileInputComponent.clearFileData();
    }
    this.isFileRemoved = true;
  }

  previewFile(file: { id: number, name: string }) {
    const files = this.addNewsEventForm.get('file')!.value;
    if (file.id) {
      this.service.getFilePreview(file.id, 'blob').pipe(takeUntil(this.ngUnsubscribe$)).subscribe((blob: Blob) => {
        this.uiService.openFile(blob);
      });
    } else {
      this.uiService.openFile(files[0]);
    }
  }

  prepareFilesList = (files: File[] | null) => {
    if (files) {
      this.fileList = [];
      this.fileList = [...this.fileList, { id: 0, name: files[0].name }];
    }
  };

  prepareFormData(): FormData {
    const file = this.addNewsEventForm.get('file')?.value;
    const formData = new FormData();
    formData.append('title', this.f?.['title']?.value);
    formData.append('startDate', this.uiService.convertDateFormat(this.f?.['startDate']?.value, DateFormats.YYYY_MM_DD));
    formData.append('endDate', this.uiService.convertDateFormat(this.f?.['endDate']?.value, DateFormats.YYYY_MM_DD));
    formData.append('file.fileName', '');
    formData.append('file.uniqueFileName', '');
    if (file) {
      formData.append('file.formFile', file[0], file[0].name);
    }
    formData.append('isActive', this.f['status'].value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE ? 'true' : 'false');
    formData.append('isFileRemoved', this.isFileRemoved ? 'true' : 'false');
    return formData;
  }

  private initializeForm(): void {
    this.addNewsEventForm = this.fb.group({
      title: ["", [Validators.required, Validators.maxLength(200)]],
      startDate: ["", [Validators.required]],
      endDate: ["", [Validators.required]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }],
      file: [null]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.ADMIN.NEWS_EVENT.NEWS_EVENT_ABSOLUTE]); });
  }

  private setTextBoxConfig = (): void => {
    this.title = {
      label: 'Title',
      formControlName: 'title',
      type: InputType.text,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };
    this.startDate = {
      label: 'Start Date',
      formControlName: 'startDate',
      needOnKeyDown: true,
      onChangeDate: () => { },
      max: () => this.addNewsEventForm.get('endDate')?.value,
      isRequired: true
    };
    this.endDate = {
      label: 'End Date',
      formControlName: 'endDate',
      needOnKeyDown: true,
      onChangeDate: () => { },
      min: () => this.addNewsEventForm.get('startDate')?.value,
      isRequired: true
    };
    this.file = {
      label: "Document",
      maxSize: 10,
      allowedExtensions: ['.pdf', '.xls', '.xlsx', '.jpg', '.jpeg', '.doc', '.docx', '.csv'],
      multipleSelection: false,
      isRequired: true
    };
    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);
  };

  private getNewsEventById(id: number) {
    this.service.getNewsEventById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<INewsEventObject>) => {
        if (res.isSuccess && res.data) {
          this.addNewsEventForm.setValue({
            title: res.data?.title || "",
            startDate: res.data?.startDate || new Date(""),
            endDate: res.data?.endDate || new Date(""),
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            file: null
          });
          if (res.data?.newsEventFileName) {
            this.fileList = [...this.fileList, { id: res.data.id, name: res.data.newsEventFileName }];
          } else {
            this.fileList = [];
          }
        }
      }
    });
  }

  private handleSubmit(): void {
    const isFormValid = this.addNewsEventForm.valid;
    const hasSelectedFiles = this.fileList && this.fileList.length > 0;

    if ((isFormValid && hasSelectedFiles && ((!this.fileError && !hasSelectedFiles) || hasSelectedFiles)) && !this.fileError) {
      const formData = this.prepareFormData();
      this.loading = true;

      const api = this.isEdit ? this.service.updateNewsEvent(Number(this.newsEventId), formData) : this.service.addNewsEvent(formData);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<INewsEventObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.NEWS_EVENT.NEWS_EVENT_ABSOLUTE]);
          }
        },
        error: () => {
          this.loading = false;
        }
      });
    }
    else {
      this.fileSubmitted = false;
    }
  }

  private OnSave(): void {
    this.submitted = true;
    this.fileSubmitted = true;
    timer(200).pipe(takeUntil(this.ngUnsubscribe$)).subscribe(() => {
      this.handleSubmit();
    });
  }
  // #endregion
}
