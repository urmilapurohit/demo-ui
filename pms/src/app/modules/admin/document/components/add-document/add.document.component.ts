import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { BaseResponseModel, Button, DropDown, DropdownValue, FileInput, FileInputComponent, GlobalService, InputType, TextField } from 'workspace-library';
import { Subject, takeUntil, timer } from 'rxjs';
import { ACTIVE_INACTIVE_STATUS_LABEL, MaxDisplayOrder } from '@constants/constant';
import { BreadcrumbItem } from '@models/common.model';
import { UIService } from '@services/ui.service';
import { ROUTES } from '@constants/routes';
import { IDocumentObject, IFileListType } from '../../models/document';
import { DocumentService } from '../../services/document.service';

@Component({
  selector: 'app-add.document',
  templateUrl: './add.document.component.html',
  styleUrl: './add.document.component.css'
})
export class AddDocumentComponent implements OnInit, OnDestroy {
  // #region initialize variables
  @ViewChild('fileInputComponent') fileInputComponent: FileInputComponent | undefined;
  addDocumentFormGroup!: FormGroup;
  title!: TextField;
  status!: DropDown;
  documentCategory!: DropDown;
  displayOrder!: TextField;
  file!: FileInput;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  fileSubmitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  documentId: string = '';
  fileList: IFileListType[] = [];
  fileError: boolean = false;
  documentCategoryList!: DropdownValue[];
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: DocumentService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService,
    private uiService: UIService
  ) {
    this.documentId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.documentId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addDocumentFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getDocumentById(Number(this.documentId));
    }
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.getDocumentCategoryList();
    this.setBreadcrumb();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  setBreadcrumb(): void {
    const LABEL = this.isEdit ? 'Edit Document' : 'Add Document';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Document', link: ROUTES.ADMIN.DOCUMENT.DOCUMENT_ABSOLUTE },
      { label: LABEL, link: '' },
    ];
  }

  fileBrowseHandler(file: File[] | null) {
    this.addDocumentFormGroup.setValue({
      ...this.addDocumentFormGroup.value,
      status: this.addDocumentFormGroup.get('status')!.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE ? 'Active' : 'InActive',
      file
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
    this.addDocumentFormGroup.setValue({
      ...this.addDocumentFormGroup.value,
      status: this.addDocumentFormGroup.get('status')!.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE ? 'Active' : 'InActive',
      file: null
    });
    if (this.fileInputComponent) {
      this.fileInputComponent.clearFileData();
    }
  }

  previewDocument(file: { id: number, name: string }) {
    const files = this.addDocumentFormGroup.get('file')!.value;
    if (file.id) {
      this.service.getDocumentPreview(file.id, 'blob').pipe(takeUntil(this.ngUnsubscribe$)).subscribe((blob: Blob) => {
        this.uiService.openFile(blob);
      });
    } else {
      this.uiService.openFile(files[0]);
    }
  }

  prepareFormData(): FormData {
    const file = this.addDocumentFormGroup.get('file')?.value;
    const formData = new FormData();
    formData.append('title', this.addDocumentFormGroup.get('title')!.value);
    formData.append('documentCategoryId', this.addDocumentFormGroup.get('documentCategory')!.value);
    formData.append('displayOrder', this.addDocumentFormGroup.get('displayOrder')!.value);
    formData.append('isActive', this.addDocumentFormGroup.get('status')!.value === ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE ? 'true' : 'false');
    if (file) {
      formData.append('file.formFile', file[0], file[0].name);
    }
    formData.append('file.fileName', '');
    formData.append('file.uniqueFileName', '');
    return formData;
  }

  prepareFilesList = (files: File[] | null) => {
    if (files) {
      this.fileList = [];
      this.fileList = [...this.fileList, { id: 0, name: files[0].name }];
    }
  };

  private getDocumentCategoryList() {
    this.uiService.getDropdownOptions(this.service.getDocumentCategories(), false).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (data: DropdownValue[]) => {
        this.documentCategoryList = data;
        this.setTextBoxConfig();
      }
    });
  }

  private initializeForm(): void {
    this.addDocumentFormGroup = this.fb?.group({
      title: ["", [Validators.required]],
      documentCategory: ["", [Validators.required]],
      status: [{ value: ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE, disabled: !this.isEdit }, [Validators.required]],
      displayOrder: [null, [Validators.required, Validators.min(1), Validators.max(MaxDisplayOrder)]],
      file: [null]
    });
  }

  private setButtonConfig(): void {
    this.saveButtonConfig = this.uiService.getSaveButtonConfig(() => { this.OnSave(); });
    this.cancelButtonConfig = this.uiService.getCancelButtonConfig(() => { this.router.navigate([ROUTES.ADMIN.DOCUMENT.DOCUMENT_ABSOLUTE]); });
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

    this.documentCategory = {
      data: {
        data: this.documentCategoryList,
      },
      feature: {
        allowMultiple: false
      },
      id: 'documentCategory',
      formControlName: 'documentCategory',
      label: 'document Category',
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.displayOrder = {
      label: 'Display Order',
      formControlName: 'displayOrder',
      type: InputType.number,
      customClass: 'custom-form-control',
      onEnterPress: () => { this.OnSave(); },
      isRequired: true
    };

    this.file = {
      label: "Document",
      maxSize: 10,
      allowedExtensions: ['.pdf'],
      multipleSelection: false,
      isRequired: true,
      suggestionMessage: "Maximum file upload size should be 10mb and only '.pdf' file type is allowed."
    };

    this.status = this.uiService.getStatusFieldConfig(() => { this.OnSave(); }, true);
  };

  private getDocumentById(id: number) {
    this.service.getDocumentById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IDocumentObject>) => {
        if (res.isSuccess && res.data) {
          this.addDocumentFormGroup.setValue({
            title: res.data?.title || "",
            documentCategory: res.data?.documentCategoryId || "",
            displayOrder: res.data?.displayOrder,
            status: res.data?.isActive ? ACTIVE_INACTIVE_STATUS_LABEL.ACTIVE : ACTIVE_INACTIVE_STATUS_LABEL.INACTIVE,
            file: null
          });
          if (res.data?.documentFileName) {
            this.fileList = [...this.fileList, { id: res.data.id, name: res.data.documentFileName }];
          } else {
            this.fileList = [];
          }
        }
      }
    });
  }

  private handleSubmit(): void {
    const isFormValid = this.addDocumentFormGroup.valid;
    const hasSelectedFiles = this.fileList && this.fileList.length > 0;
    if ((isFormValid && hasSelectedFiles && ((!this.fileError && !hasSelectedFiles) || hasSelectedFiles)) && !this.fileError) {
      const formData = this.prepareFormData();
      this.loading = true;

      const api = this.isEdit ? this.service.updateDocument(Number(this.documentId), formData) : this.service.addDocument(formData);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IDocumentObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.DOCUMENT.DOCUMENT_ABSOLUTE]);
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
