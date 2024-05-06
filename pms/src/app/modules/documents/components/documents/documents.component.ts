import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Button, DropDown, DropdownValue } from 'workspace-library';
import { DomSanitizer } from '@angular/platform-browser';
import { UIService } from '@services/ui.service';
import { BreadcrumbItem } from '@models/common.model';
import { Subject, takeUntil } from 'rxjs';
import { DocumentsService } from '../../services/documents.service';

@Component({
  selector: 'app-documents',
  templateUrl: './documents.component.html',
  styleUrl: './documents.component.css'
})
export class DocumentsComponent implements OnInit, OnDestroy {
  // #region initialize variables
  category!: DropDown;
  subCategory!: DropDown;
  searchBtnConfig!: Button;
  resetBtnConfig!: Button;
  filterForm!: FormGroup;
  document: any;
  categoryData: DropdownValue[] = [];
  subCategoryData: DropdownValue[] = [];
  documentId!: string;
  breadcrumbItems: BreadcrumbItem[] = [];
  submitted = false;
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private service: DocumentsService,
    private fb: FormBuilder,
    private uiService: UIService,
    private sanitizer: DomSanitizer,
  ) { }
  // #endregion

  ngOnInit(): void {
    this.initializeForm();
    this.setTextBoxConfig();
    this.setButtonConfig();
    this.setBreadcrumb();
    this.getCategory();
  }

  ngOnDestroy(): void {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
    this.ngUnsubscribe$.unsubscribe();
  }

  // #region methods
  viewDocument(document: string | null | undefined): boolean {
    return this.uiService.toSafeString(document) !== '';
  }

  setBreadcrumb(): void {
    this.breadcrumbItems = [];
  }

  private initializeForm(): void {
    this.filterForm = this.fb?.group({
      subCategory: ["", [Validators.required]],
      category: ["", [Validators.required]]
    });
  }

  private setTextBoxConfig = (): void => {
    this.category = {
      data: {
        data: this.categoryData,
      },
      feature: {
        allowMultiple: false
      },
      id: 'category',
      formControlName: 'category',
      label: 'Category',
      isRequired: true,
      customFormFieldClass: 'custom-form-group sm-form-group',
      selectionChange: (response) => { this.getSubCategory(Number(response.value)); }
    };
    this.subCategory = {
      data: {
        data: this.subCategoryData,
      },
      feature: {
        allowMultiple: false
      },
      id: 'subCategory',
      formControlName: 'subCategory',
      label: 'Sub Category',
      isRequired: true,
      customFormFieldClass: 'custom-form-group sm-form-group',
      onEnterPress: () => { this.applyFilter(); }
    };
  };

  private setButtonConfig(): void {
    this.searchBtnConfig = this.uiService.getSearchButtonConfig(() => { this.applyFilter(); });
    this.resetBtnConfig = this.uiService.getResetButtonConfig(() => { this.resetFilter(); });
  }

  private getCategory() {
    this.uiService.getDropdownOptions(this.service.getCategory(), true, { id: "", text: 'Select Category' })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe({
        next: (data: DropdownValue[]) => {
          this.categoryData = data;
          this.subCategoryData.unshift({ id: "", text: 'Select Sub Category' });
          this.setTextBoxConfig();
        }
      });
  }

  private getSubCategory(id: number) {
    const documentCategory = this.filterForm.get('category')?.value;
    if (documentCategory) {
      this.uiService.getDropdownOptions(this.service.getDocumentTitles(id), true, { id: "", text: 'Select Sub Category' })
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (data: DropdownValue[]) => {
            this.subCategoryData = data;
            this.filterForm.patchValue({
              subCategory: '',
            });
            this.setTextBoxConfig();
          }
        });
    } else {
      this.filterForm.patchValue({
        subCategory: '',
      });
      this.subCategoryData = [];
      this.subCategoryData.unshift({ id: "", text: 'Select Sub Category' });
      this.setTextBoxConfig();
    }
  }

  private getDocument() {
    if (this.documentId !== '' && this.documentId !== null && this.documentId !== undefined) {
      this.service.getDocument(Number(this.documentId), 'blob')
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe({
          next: (blob: Blob) => {
            if (blob) {
              const blobUrl = URL.createObjectURL(blob);
              this.document = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
            }
          },
          error: () => {
            this.document = '';
          }
        });
    } else {
      this.document = '';
    }
  }

  private resetFilter(): void {
    this.submitted = false;
    this.filterForm.patchValue({
      category: '',
      subCategory: '',
    });
    this.document = '';
    this.subCategoryData = [];
    this.subCategoryData.unshift({ id: "", text: 'Select Sub Category' });
    this.setTextBoxConfig();
  }

  private applyFilter(): void {
    this.submitted = true;
    this.documentId = this.filterForm.get('subCategory')?.value;
    this.getDocument();
  }
  // #endregion
}
