import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseResponseModel, Button, ButtonType, GLOBAL_CONSTANTS, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { BreadcrumbItem } from '@models/common.model';
import { Subject, takeUntil } from 'rxjs';
import { DocumentCategoryService } from '../../services/document.category.service';
import { IDocumentCategory, IDocumentCategoryObject } from '../../models/document.category';

@Component({
  selector: 'app-add.document.category',
  templateUrl: './add.document.category.component.html',
  styleUrl: './add.document.category.component.css'
})
export class AddDocumentCategoryComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addDocumentCategoryFormGroup!: FormGroup;
  name!: TextField;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  documentCategoryId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: DocumentCategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {
    this.documentCategoryId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.documentCategoryId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addDocumentCategoryFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getDocumentCategoryById(Number(this.documentCategoryId));
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
    const LABEL = this.isEdit ? 'Edit Document Category' : 'Add Document Category';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Document Category', link: '/admin/document-category' },
      { label: LABEL, link: '' },
    ];
  }

  private getDocumentCategoryById(id: number) {
    this.service.getDocumentCategoryById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IDocumentCategoryObject>) => {
        if (res.isSuccess && res.data) {
          this.addDocumentCategoryFormGroup.setValue({
            name: res.data?.name || ""
          });
        }
      }
    });
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
  };

  private initializeForm(): void {
    this.addDocumentCategoryFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(100)]]
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
      callback: () => { this.router.navigate([ROUTES.ADMIN.DOCUMENT_CATEGORY.DOCUMENT_CATEGORY_ABSOLUTE]); }
    };
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addDocumentCategoryFormGroup.valid) {
      const data: IDocumentCategory = {
        name: this.f?.['name']?.value
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateDocumentCategory(Number(this.documentCategoryId), data) : this.service.addDocumentCategory(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IDocumentCategoryObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.DOCUMENT_CATEGORY.DOCUMENT_CATEGORY_ABSOLUTE]);
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
