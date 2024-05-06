import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BaseResponseModel, Button, ButtonType, GLOBAL_CONSTANTS, GlobalService, InputType, TextField } from 'workspace-library';
import { ActivatedRoute, Router } from '@angular/router';
import { ROUTES } from '@constants/routes';
import { BreadcrumbItem } from '@models/common.model';
import { Subject, takeUntil } from 'rxjs';
import { IBookCategory, IBookCategoryObject } from '../../models/book.category';
import { BookCategoryService } from '../../services/book.category.service';

@Component({
  selector: 'app-add.book.category',
  templateUrl: './add.book.category.component.html',
  styleUrl: './add.book.category.component.css'
})
export class AddBookCategoryComponent implements OnInit, OnDestroy {
  // #region initialize variables
  addBookCategoryFormGroup!: FormGroup;
  name!: TextField;
  saveButtonConfig!: Button;
  cancelButtonConfig!: Button;
  submitted: boolean = false;
  loading: boolean = false;
  isEdit: boolean = false;
  bookCategoryId: string = '';
  breadcrumbItems: BreadcrumbItem[] = [];
  private ngUnsubscribe$ = new Subject<void>();
  // #endregion

  // #region constructor
  constructor(
    private fb: FormBuilder,
    private service: BookCategoryService,
    private router: Router,
    private route: ActivatedRoute,
    private globalService: GlobalService
  ) {
    this.bookCategoryId = this.route.snapshot.paramMap.get('id') ?? '';
    if (Number(this.bookCategoryId) > 0) {
      this.isEdit = true;
    }
  }
  // #endregion

  get f() {
    return this.addBookCategoryFormGroup.controls;
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.isEdit) {
      this.getBookCategoryById(Number(this.bookCategoryId));
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
    const LABEL = this.isEdit ? 'Edit Book Category' : 'Add Book Category';
    this.breadcrumbItems = [
      { label: 'Admin', link: '' },
      { label: 'Book Category', link: '/admin/book-category' },
      { label: LABEL, link: '' },
    ];
  }

  private initializeForm(): void {
    this.addBookCategoryFormGroup = this.fb?.group({
      name: ["", [Validators.required, Validators.maxLength(250)]]
    });
  }

  private getBookCategoryById(id: number) {
    this.service.getBookCategoryById(id).pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
      next: (res: BaseResponseModel<IBookCategoryObject>) => {
        if (res.isSuccess && res.data) {
          this.addBookCategoryFormGroup.setValue({
            name: res.data?.name || "",
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
      callback: () => { this.router.navigate([ROUTES.ADMIN.BOOK_CATEGORY.BOOK_CATEGORY_ABSOLUTE]); }
    };
  }

  private OnSave(): void {
    this.submitted = true;
    if (this.addBookCategoryFormGroup.valid) {
      const data: IBookCategory = {
        name: this.f?.['name']?.value
      };
      this.loading = true;

      const api = this.isEdit ? this.service.updateBookCategory(Number(this.bookCategoryId), data) : this.service.addBookCategory(data);

      api.pipe(takeUntil(this.ngUnsubscribe$)).subscribe({
        next: (res: BaseResponseModel<IBookCategoryObject>) => {
          if (res.isSuccess) {
            this.loading = false;
            this.globalService.openSnackBar(res.message);
            this.router.navigate([ROUTES.ADMIN.BOOK_CATEGORY.BOOK_CATEGORY_ABSOLUTE]);
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
